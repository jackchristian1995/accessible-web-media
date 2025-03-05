import supabase from '~/server/utils/supabase';

export default defineEventHandler(async (event) => {
  const authToken = getCookie(event, 'auth_token');
  const { data: { user }, error: authError } = await supabase.auth.getUser(authToken);
  if (authError) throw createError({ statusMessage: authError.message, statusCode: 401 });

  // Get list of all files
  const { data, error } = await supabase.storage.from('captions').list(user.id);
  if (error) throw createError({ statusMessage: error.message, statusCode: 401 });

  // Return download link to file
  return data;
});