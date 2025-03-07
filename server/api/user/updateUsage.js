import supabase from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  const { fileType } = await readBody(event);

  const authToken = getCookie(event, 'auth_token');
  const { data: { user }, error: authError } = await supabase.auth.getUser(authToken);
  if (authError) throw createError({ statusMessage: authError.message });

  const thisMonth = new Date(Date.now()).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }).replace(' ', '-');
  const { data, error: dbError } = await supabase.from('usage').select().eq('month', thisMonth).eq('user_id', user.id);
  if (dbError) throw createError({ statusMessage: dbError.message });
  
  if (data.length) {  
    const toUpdate = fileType.includes('image') ? { image_usage: data[0].image_usage + 1 } : { audio_usage: data[0].audio_usage + 1 }
    const { error } = await supabase.from('usage').update(toUpdate).eq('user_id', user.id).eq('month', thisMonth);
    if (error) throw createError({ statusMessage: error.message });
  } else {
    const toUpdate = fileType.includes('image') ? { image_usage: 1 } : { audio_usage: 1 }
    const { error } = await supabase.from('usage').insert({
      ...toUpdate,
      user_id: user.id,
      month: thisMonth
    });
    if (error) throw createError({ statusMessage: error.message });
  }

  return true
});