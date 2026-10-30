-- PROPOSED (not yet applied): pin search_path on the capacity functions.
-- Fixes Supabase advisor 0011 (function_search_path_mutable).
-- Logic is unchanged; the only edits are SET search_path = '' and fully
-- qualifying the table as public.wtsf_capacity. Same names, arguments and
-- return types, so the existing reserve_slot RPC call keeps working.

CREATE OR REPLACE FUNCTION public.reserve_slot(category_id text)
 RETURNS TABLE(success boolean, slot_status text, remaining integer)
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
DECLARE
  cap RECORD;
  new_reserved INTEGER;
BEGIN
  SELECT * INTO cap FROM public.wtsf_capacity WHERE id = category_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 'not_found'::TEXT, 0;
    RETURN;
  END IF;
  IF cap.reserved_slots >= cap.total_slots THEN
    UPDATE public.wtsf_capacity SET status = 'sold_out' WHERE id = category_id;
    RETURN QUERY SELECT false, 'sold_out'::TEXT, 0;
    RETURN;
  END IF;
  new_reserved := cap.reserved_slots + 1;
  UPDATE public.wtsf_capacity
  SET
    reserved_slots = new_reserved,
    status = CASE
      WHEN new_reserved >= cap.total_slots               THEN 'sold_out'
      WHEN new_reserved >= (cap.total_slots * 0.9)::INT  THEN 'limited'
      ELSE 'open'
    END,
    updated_at = now()
  WHERE id = category_id;
  RETURN QUERY SELECT true, 'reserved'::TEXT, (cap.total_slots - new_reserved);
END;
$function$;

CREATE OR REPLACE FUNCTION public.release_slot(category_id text)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
BEGIN
  UPDATE public.wtsf_capacity
  SET
    reserved_slots = GREATEST(0, reserved_slots - 1),
    status = CASE
      WHEN GREATEST(0, reserved_slots - 1) >= total_slots               THEN 'sold_out'
      WHEN GREATEST(0, reserved_slots - 1) >= (total_slots * 0.9)::INT  THEN 'limited'
      ELSE 'open'
    END,
    updated_at = now()
  WHERE id = category_id;
END;
$function$;

-- Also: only the server calls these. Remove public execute rights so the
-- public API can't invoke them directly (they already can't change rows,
-- because RLS gives anon read-only access to wtsf_capacity).
REVOKE EXECUTE ON FUNCTION public.reserve_slot(text), public.release_slot(text) FROM anon, authenticated, public;
GRANT  EXECUTE ON FUNCTION public.reserve_slot(text), public.release_slot(text) TO service_role;
