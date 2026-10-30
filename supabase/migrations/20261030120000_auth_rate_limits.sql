-- PROPOSED (not yet applied): shared rate-limit counters for admin auth routes.
--
-- What is stored: an opaque HMAC-SHA256 key per bucket (e.g. "login + visitor
-- IP + email"), an attempt count, the window start and an optional temporary
-- block expiry. No IP addresses, emails, passwords or tokens are stored.
--
-- Access: server only (service_role). RLS on with no public policies, all
-- privileges revoked from anon/authenticated, functions not callable publicly.
-- Blocks always expire on their own — there is no permanent lockout.

CREATE TABLE public.wtsf_auth_rate_limits (
  bucket_key        text        PRIMARY KEY CHECK (bucket_key ~ '^[a-z_]+:[0-9a-f]{64}$'),
  attempts          integer     NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  window_started_at timestamptz NOT NULL DEFAULT now(),
  blocked_until     timestamptz,
  updated_at        timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.wtsf_auth_rate_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.wtsf_auth_rate_limits FROM anon, authenticated;
CREATE POLICY service_full_access_auth_rate_limits
  ON public.wtsf_auth_rate_limits FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Seconds until this bucket may try again (0 = allowed now).
CREATE FUNCTION public.wtsf_rate_limit_status(p_key text)
 RETURNS integer
 LANGUAGE sql
 STABLE
 SET search_path = ''
AS $function$
  SELECT COALESCE(
    (SELECT GREATEST(0, CEIL(EXTRACT(EPOCH FROM (blocked_until - now())))::integer)
       FROM public.wtsf_auth_rate_limits
      WHERE bucket_key = p_key AND blocked_until > now()),
    0);
$function$;

-- Record one attempt atomically. Starts a fresh window when the old one has
-- ended. When attempts reach p_max inside the window, blocks the bucket for
-- p_block_seconds. Returns seconds blocked (0 = still allowed).
CREATE FUNCTION public.wtsf_rate_limit_record(
  p_key text, p_max integer, p_window_seconds integer, p_block_seconds integer)
 RETURNS integer
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
DECLARE
  v_attempts integer;
  v_blocked  timestamptz;
BEGIN
  IF p_max < 1 OR p_window_seconds < 1 OR p_block_seconds < 1 OR p_block_seconds > 86400 THEN
    RAISE EXCEPTION 'invalid rate limit parameters';
  END IF;

  INSERT INTO public.wtsf_auth_rate_limits AS r (bucket_key, attempts, window_started_at, updated_at)
  VALUES (p_key, 1, now(), now())
  ON CONFLICT (bucket_key) DO UPDATE SET
    attempts = CASE
      WHEN r.window_started_at < now() - make_interval(secs => p_window_seconds)
        AND (r.blocked_until IS NULL OR r.blocked_until <= now())
      THEN 1 ELSE r.attempts + 1 END,
    window_started_at = CASE
      WHEN r.window_started_at < now() - make_interval(secs => p_window_seconds)
        AND (r.blocked_until IS NULL OR r.blocked_until <= now())
      THEN now() ELSE r.window_started_at END,
    blocked_until = CASE
      WHEN r.blocked_until IS NOT NULL AND r.blocked_until <= now() THEN NULL
      ELSE r.blocked_until END,
    updated_at = now()
  RETURNING attempts, blocked_until INTO v_attempts, v_blocked;

  IF v_attempts >= p_max AND (v_blocked IS NULL OR v_blocked <= now()) THEN
    UPDATE public.wtsf_auth_rate_limits
       SET blocked_until = now() + make_interval(secs => p_block_seconds),
           updated_at = now()
     WHERE bucket_key = p_key
    RETURNING blocked_until INTO v_blocked;
  END IF;

  -- Housekeeping: drop buckets idle for over a day (bounded per call).
  DELETE FROM public.wtsf_auth_rate_limits
   WHERE bucket_key IN (
     SELECT bucket_key FROM public.wtsf_auth_rate_limits
      WHERE updated_at < now() - interval '1 day'
        AND (blocked_until IS NULL OR blocked_until < now())
      LIMIT 50);

  RETURN CASE WHEN v_blocked > now()
              THEN CEIL(EXTRACT(EPOCH FROM (v_blocked - now())))::integer ELSE 0 END;
END;
$function$;

-- Forget a bucket (called after a successful login for that visitor+email).
CREATE FUNCTION public.wtsf_rate_limit_clear(p_key text)
 RETURNS void
 LANGUAGE sql
 SET search_path = ''
AS $function$
  DELETE FROM public.wtsf_auth_rate_limits WHERE bucket_key = p_key;
$function$;

REVOKE EXECUTE ON FUNCTION public.wtsf_rate_limit_status(text),
                           public.wtsf_rate_limit_record(text, integer, integer, integer),
                           public.wtsf_rate_limit_clear(text)
  FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.wtsf_rate_limit_status(text),
                          public.wtsf_rate_limit_record(text, integer, integer, integer),
                          public.wtsf_rate_limit_clear(text)
  TO service_role;
