import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const authToken = getCookie(event, 'auth_token');
  const supabase = createClient(useRuntimeConfig().supabaseUrl, useRuntimeConfig().supabaseServiceKey);
  const { data: { user }, error: authError } = await supabase.auth.getUser(authToken);
  if (authError) throw createError({ statusMessage: authError.message });
  
  const { error } = await supabase.auth.admin.deleteUser(user.id);
  if (error) throw createError({ statusCode: 500, statusMessage: error.message });

  deleteCookie(event, 'auth_token');
  deleteCookie(event, 'refresh_token');

  return true;
});