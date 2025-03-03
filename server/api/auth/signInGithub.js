import supabase from '~/server/utils/supabase';

export default defineEventHandler(async (event) => {
  const { redirectUrl } = await readBody(event);

  const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'github', options: { redirectTo: redirectUrl } });
  if (error) throw createError({ statusMessage: error.message });

  return data?.url;
});