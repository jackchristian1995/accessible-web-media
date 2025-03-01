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
import Toaster from '~/components/ui/toast/Toaster.vue';
</script>

<style scoped>
nav.w-full {
  width: calc(100% - 3rem);
}
</style>