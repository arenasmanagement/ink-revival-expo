-- APPLIED to production 2026-10-30 (migration "lock_admin_tables").
-- Recorded here for history only.
ALTER TABLE public.wtsf_admin_notes    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wtsf_admin_activity ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.wtsf_admin_notes, public.wtsf_admin_activity FROM anon, authenticated;
CREATE POLICY service_full_access_admin_notes
  ON public.wtsf_admin_notes FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY service_full_access_admin_activity
  ON public.wtsf_admin_activity FOR ALL TO service_role USING (true) WITH CHECK (true);
