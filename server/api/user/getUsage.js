import supabase from '~/server/utils/supabase';

export default defineEventHandler(async (event) => {
  const authToken = getCookie(event, 'auth_token');
  const { data: { user }, error: authError } = await supabase.auth.getUser(authToken);
  if (authError) throw createError({ statusMessage: authError.message });

  const thisMonth = new Date(Date.now()).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }).replace(' ', '-');
  const { data, error: dbError } = await supabase.from('usage').select().eq('month', thisMonth).eq('user_id', user.id);
  if (dbError) throw createError({ statusMessage: dbError.message });

  return data;
});