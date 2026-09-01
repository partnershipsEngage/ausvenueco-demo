import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseReady = Boolean(url && anon);

export const supabase = isSupabaseReady
  ? createClient(url as string, anon as string)
  : null;
