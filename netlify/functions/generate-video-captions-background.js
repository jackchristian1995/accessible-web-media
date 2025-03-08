import { createClient as createDeepgramClient, webvtt } from '@deepgram/sdk';
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const { NUXT_SUPABASE_URL, NUXT_SUPABASE_KEY, NUXT_DEEPGRAM_KEY } = process.env;

export default async (event, context) => {
  try {
    const body = await event.formData();
    const video = body.get('media');
    const arrayBuffer = await video.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);

    // Generate transcript
    const deepgram = createDeepgramClient(NUXT_DEEPGRAM_KEY);
    const { result, error: deepgramError } = await deepgram.listen.prerecorded.transcribeFile(audioBuffer, {
      model: "nova-3",
      smart_format: true,
      utterances: true
    });
    if (deepgramError) throw new Error(deepgramError.message);

    const captions = webvtt(result);
    const filename = video.name.split('.')[0];

    // Store captions as a downloadable file
    const authToken = context.cookies.get('auth_token');
    const supabase = createSupabaseClient(NUXT_SUPABASE_URL, NUXT_SUPABASE_KEY, {
      global: { headers: { Authorization: `Bearer ${authToken}` } },
    });
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw new Error(authError.message);
    
    const { data, error: uploadError } = await supabase.storage.from('captions').upload(`${user.id }/${Date.now()}-${filename}.vtt`, captions, { contentType: 'text/vtt' });
    if (uploadError) throw new Error(uploadError.message);
    
    return;
  } catch (error) {
    console.error(error.message);
    return new Response({
      statusCode: 400,
      statusMessage: JSON.stringify({ error: error.message }),
    });
  }
}
