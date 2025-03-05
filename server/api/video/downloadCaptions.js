import supabase from '~/server/utils/supabase';

export default defineEventHandler(async (event) => {
  const { filename } = await readBody(event);

  const authToken = getCookie(event, 'auth_token');
  const { data: { user }, error: authError } = await supabase.auth.getUser(authToken);
  if (authError) throw createError({ statusMessage: authError.message, statusCode: 401 });

  const path = `${user.id}/${filename}`;

  const { data: { signedUrl: downloadUrl }, error: downloadError } = await supabase.storage.from('captions').createSignedUrl(path, 60, {
    download: true
  });
  
  if (downloadError) throw createError({ statusMessage: downloadError.message });

  // Return download link to file
  return downloadUrl;
});