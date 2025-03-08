import supabase from '~/server/utils/supabase';

export default defineEventHandler(async (event) => {
  const { path } = await readBody(event);

  const { data: { signedUrl: downloadUrl }, error: downloadError } = await supabase.storage.from('transcripts').createSignedUrl(path, 60 * 30, { download: true });
  if (downloadError) throw createError({ statusMessage: downloadError.message });

  // Return download link to file
  return downloadUrl;
});