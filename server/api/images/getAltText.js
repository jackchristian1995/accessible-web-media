import supabase from "~/server/utils/supabase";
import Replicate from "replicate";

export default defineEventHandler(async (event) => {
  const body = await readMultipartFormData(event);
  if (body.length > 1) throw createError({ statusMessage: 'Only one file can be parsed at a time.' });

  const file = body[0];
  if (!file.type.includes('image/')) throw createError({ statusMessage: 'This API endpoint is only for images.' });
  
  // Upload image to temporary storage
  const { data: { path }, error: uploadError } = await supabase.storage.from('tmp').upload(`${Date.now()}-${file.filename}`, file.data, { contentType: file.type });  
  if (uploadError) throw createError({ statusMessage: uploadError.message });
  
  // Retreive signed URL for AI to access the file
  const { data: { signedUrl }, error: urlError } = await supabase.storage.from('tmp').createSignedUrl(path, 60);
  if (urlError) throw createError({ statusMessage: urlError.message });
  
  try {
    // Generate alt text
    const replicate = new Replicate({ auth: useRuntimeConfig().replicateToken });
    const output = await replicate.run(
      "salesforce/blip:2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746",
      {
        input: {
          task: "image_captioning",
          image: signedUrl
        }
      }
    );

    // Delete file from temporary storage
    const { data, error: deleteError } = await supabase.storage.from('tmp').remove([path]);
    if (deleteError) throw createError({ statusMessage: deleteError.message });
    
    // Return alt text
    return output.replace('Caption: ', '');
  } catch (error) {
    console.error(error.message);
    
    throw createError({ statusMessage: error.message });
  }
});