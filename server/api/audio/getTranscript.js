import supabase from '~/server/utils/supabase';
import { createClient, srt } from '@deepgram/sdk';

export default defineEventHandler(async (event) => {
  const body = await readFormData(event);

  if (body.length > 1) throw createError({ statusMessage: 'Only one file can be parsed at a time.' });

  const audio = body.get('media');
  const arrayBuffer = await audio.arrayBuffer();
  const audioBuffer = Buffer.from(arrayBuffer);
  
  // Generate transcript
  const deepgram = createClient(useRuntimeConfig().deepgramKey);
  const { result, error } = await deepgram.listen.prerecorded.transcribeFile(audioBuffer, {
    model: "nova-3",
    smart_format: true,
    utterances: true
  });
  if (error) throw createError({ statusMessage: error.message });

  const transcript = srt(result);

  // Store transcript as a downloadable file
  const { data, error: srtError } = await supabase.storage.from('transcripts').upload(`${Date.now()}-${audio.name}.srt`, transcript, { contentType: 'text/srt' });
  if (srtError) throw createError({ statusMessage: srtError.message });
  
  const { data: { signedUrl: downloadUrl }, error: downloadError } = await supabase.storage.from('transcripts').createSignedUrl(data.path, 60);
  
  if (downloadError) throw createError({ statusMessage: downloadError.message });

  // Return download link to file
  return downloadUrl;
});