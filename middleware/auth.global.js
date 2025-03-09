import { useAuthStore } from "~/stores/AuthStore";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.server) return
  // Allow access to the login route without checks

  const { $pinia } = useNuxtApp();
  const AuthStore = useAuthStore($pinia);

  try {
    // Call the server to verify if the user is authenticated
    const verified = await $fetch('/api/auth/verify', { method: 'GET' });
    if (!verified) throw new Error('Unauthorised');    
    AuthStore.setUser(verified);
  } catch (error) {
    // If verification fails, redirect to the login page
    AuthStore.setUser(undefined);
  }
});
