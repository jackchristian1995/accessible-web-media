import supabase from '~/server/utils/supabase';

export default defineEventHandler(async (event) => {
  const authToken = getCookie(event, 'auth_token');
  const { data: { user }, error: authError } = await supabase.auth.getUser(authToken);
  if (authError) throw createError({ statusMessage: authError.message, statusCode: 401 });

  // Get list of all files
  const { data: allFiles, error: listError } = await supabase.storage.from('transcripts').list(user.id);
  if (listError) throw createError({ statusMessage: listError.message });

  const fileList = allFiles.map((file) => `${user.id}/${file.name}`);

  if (fileList.length) {
    const { data, error: deleteError } = await supabase.storage.from('transcripts').remove(fileList);
    if (deleteError) throw createError({ statusMessage: deleteError.message });
  }

  return true;
});