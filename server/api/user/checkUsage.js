export default defineEventHandler(async (event) => {
  const { fileType, usage: { image_usage, audio_usage } } = await readBody(event);

  if (fileType.includes('image') && image_usage >= 50) throw createError({ statusMessage: 'Alt text generator usage exceeded.' });
  if (fileType.includes('video') && audio_usage >= 10) throw createError({ statusMessage: 'Video captions generator usage exceeded.' });
  if (fileType.includes('audio') && audio_usage >= 10) throw createError({ statusMessage: 'Audio transcript generator usage exceeded.' });

  return true
});