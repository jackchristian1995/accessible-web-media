import { createClient } from "@supabase/supabase-js";

const { supabaseUrl, supabaseKey } = useRuntimeConfig();

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  }
});

export default supabase;