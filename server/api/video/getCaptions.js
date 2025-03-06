import supabase from '~/server/utils/supabase';
import { createClient, webvtt } from '@deepgram/sdk';

export default defineEventHandler(async (event) => {
  const body = await readFormData(event);

  if (body.length > 1) throw createError({ statusMessage: 'Only one file can be parsed at a time.' });

  const authToken = getCookie(event, 'auth_token');
  const { data: { user }, error: authError } = await supabase.auth.getUser(authToken);
  if (authError) throw createError({ statusMessage: 'Sign up to gain access to video captions.', statusCode: 401 });

  const video = body.get('media');
  const arrayBuffer = await video.arrayBuffer();
  const audioBuffer = Buffer.from(arrayBuffer);
  
  // Generate transcript
  const deepgram = createClient(useRuntimeConfig().deepgramKey);
  const { result, error } = await deepgram.listen.prerecorded.transcribeFile(audioBuffer, {
    model: "nova-3",
    smart_format: true,
    utterances: true
  });
  if (error) throw createError({ statusMessage: error.message });

  const captions = webvtt(result);
  const filename = video.name.split('.')[0];

  // Store transcript as a downloadable file
  const { data, error: vttError } = await supabase.storage.from('captions').upload(`${user.id}/${Date.now()}-${filename}.vtt`, captions, { contentType: 'text/vtt' });

  if (vttError) throw createError({ statusMessage: vttError.message });

  const { data: { signedUrl: downloadUrl }, error: downloadError } = await supabase.storage.from('captions').createSignedUrl(data.path, 60 * 30, {
    download: true,
  });
  
  if (downloadError) throw createError({ statusMessage: downloadError.message });

  // Return download link to file
  return downloadUrl;
});