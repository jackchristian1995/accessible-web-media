import supabase from '~/server/utils/supabase';

export default defineEventHandler(async (event) => {
  const { hash } = await readBody(event);
  const hashArr = hash.split('&');
  const session = new Object();
  for (const value of hashArr) {
    const keyValue = value.split('=');
    session[keyValue[0]] = keyValue[1];
  }
  
  const { data, error } = await supabase.auth.refreshSession({ refresh_token: session.refresh_token });
  if (error) throw createError({ statusCode: 401, statusMessage: error.message });

  const { session: newSession, user } = data;
  const { credits, was_anon, logged_in } = user.user_metadata;

  if (was_anon && !logged_in) {
    // Set max credit balance to 2 depending on whether feedback credit has already been used
    // Also update 'logged_in' to true to avoid adding additional free credits on every login
    const { data, error: updateError } = await supabase.auth.updateUser({ data: { credits: credits === 0 ? 1 : 2, was_anon: true, logged_in: true } });
  }

  setCookie(event, 'auth_token', newSession.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: data.expires_in,
    path: '/',
  });

  setCookie(event, 'refresh_token', newSession.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });
  
  return user;
});