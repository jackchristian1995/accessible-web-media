<template>
  <div class="w-full h-full max-w-screen-xl px-6 mx-auto relative">
    <nav class="absolute top-0 w-full">
      <div class="w-full flex flex-row justify-between items-center pt-4 pb-2 border-b-2 border-white">
        <nuxt-link to="/" class="h-full w-auto block">
          <img src="/accessible-web-media-logo.svg" class="block h-5 w-auto" width="300" height="20" />
        </nuxt-link>
        <ul class="flex flex-row items-center justify-start space-x-8 p-0">
          <li>
            <nuxt-link to="/image-alt-text-generator">Generate Alt Text</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/video-caption-generator">Caption Video</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/audio-transcription-generator">Transcribe Audio</nuxt-link>
          </li>
          <li>
            <button @click.prevent="signInWithGithub">Sign in with Github</button>
          </li>
        </ul>
      </div>
    </nav>
    <div class="w-full h-full flex flex-col items-start justify-center">
      <nuxt-page />
    </div>
    <Toaster />
  </div>
</template>

<script setup>
// Component Imports
import Toaster from '~/components/ui/toast/Toaster.vue';

// Login
const signInWithGithub = async () => {
  const url = await $fetch('/api/auth/signInGithub', { method: 'POST', body: { redirectUrl: window.location.href } });
  window.location.href = url;  
}

// Auth Redirect Flow
onMounted(async () => {
  const { hash, path } = useRoute();
  if (hash.includes('refresh_token')) {
    window.history.pushState({}, null, path);
    try {
      await $fetch('/api/auth/getSessionFromHash', { method: 'POST', body: { hash } });
    } catch (err) {
      console.error(err);
    }
  }

});
</script>

<style scoped>
nav.w-full {
  width: calc(100% - 3rem);
}
</style>