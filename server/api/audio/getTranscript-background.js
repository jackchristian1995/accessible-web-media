import supabase from '~/server/utils/supabase';
import { createClient, srt } from '@deepgram/sdk';

export default defineEventHandler(async (event) => {
  const body = await readFormData(event);

  if (body.length > 1) throw createError({ statusMessage: 'Only one file can be parsed at a time.' });

  const authToken = getCookie(event, 'auth_token');
  const { data: { user }, error: authError } = await supabase.auth.getUser(authToken);
  if (authError) throw createError({ statusMessage: 'Sign up to gain access to audio transcription.', statusCode: 401 });

  const audio = body.get('media');
  const arrayBuffer = await audio.arrayBuffer();
  const audioBuffer = Buffer.from(arrayBuffer);
  
  // Generate transcript
  const deepgram = createClient(useRuntimeConfig().deepgramKey);
  const { result, error } = await deepgram.listen.prerecorded.transcribeFile(audioBuffer, {
    model: "nova-3",
    smart_format: true,
    utterances: true,
    multichannel: true
  });
  if (error) throw createError({ statusMessage: error.message });

  const transcript = srt(result);
  const filename = audio.name.split('.')[0];

  // Store transcript as a downloadable file
  const { data, error: srtError } = await supabase.storage.from('transcripts').upload(`${user.id}/${Date.now()}-${filename}.srt`, transcript, { contentType: 'text/srt' });
  if (srtError) throw createError({ statusMessage: srtError.message });
  
  const { data: { signedUrl: downloadUrl }, error: downloadError } = await supabase.storage.from('transcripts').createSignedUrl(data.path, 60, {
    download: true
  });
  
  if (downloadError) throw createError({ statusMessage: downloadError.message });

  // Return download link to file
  return downloadUrl;
});