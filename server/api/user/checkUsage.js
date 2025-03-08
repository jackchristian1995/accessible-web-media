import supabase from '~/server/utils/supabase';

export default defineEventHandler(async (event) => {
  const { fileType, usage: { image_usage, audio_usage }, user } = await readBody(event);

  const { data, error } = await supabase.from('feedback').select().eq('user_id', user);
  if (error) throw createError({ statusMessage: error.message });

  const imageLimit = data.length ? 50 : 10;
  const audioLimit = data.length ? 10 : 1000;

  if (fileType.includes('image') && image_usage >= imageLimit) throw createError({ statusMessage: 'Alt text generator usage exceeded.' });
  if (fileType.includes('video') && audio_usage >= audioLimit) throw createError({ statusMessage: 'Video captions generator usage exceeded.' });
  if (fileType.includes('audio') && audio_usage >= audioLimit) throw createError({ statusMessage: 'Audio transcript generator usage exceeded.' });

  return true
});