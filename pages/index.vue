<template>
  <div class="px-8">
    <h1>
      No more excuses! Make all your website media accessible here.
    </h1>
    <form ref="formRef" action="">
      <label for="files">
        Drop your media files below to get your accessibility features.
      </label>
      <input class="appearance-none block" type="file" multiple name="files" id="files" accept="image/*, audio/mpeg, audio/ogg, video/mp4, video/ogg" @change.prevent="sendMedia" />
    </form>
    <section id="files">
      <ul v-if="files">
        <li v-for="media of files" :key="media.file.name" class="flex flex-row justify-between space-x-8">
          <span>{{ media.file.name }}</span>
          <Loader2 v-if="!media.parsed" class="w-4 h-4 animate-spin" />
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
// Module Imports
import { ref } from 'vue';

// Component Imports
import { Loader2 } from 'lucide-vue-next';

// Form action
const formRef = ref(null);
const files = ref();
const sendMedia = async () => {
  const formData = new FormData(formRef.value);
  files.value = formData.getAll('files').map((file) => ({ file, parsed: false }));
  
  for (const media of files.value) {
    let parsed;
    const body = new FormData();
    body.append('media', media.file);
    try {
      if (media.file.type.includes('image')) parsed = await $fetch('/api/images/getAltText', { method: 'POST', body });
      if (media.file.type.includes('audio')) parsed = await $fetch('/api/audio/getTranscript', { method: 'POST', body });
      if (media.file.type.includes('video')) parsed = await $fetch('/api/video/getCaptions', { method: 'POST', body });
    } catch (error) {
      console.error(error.message);
    }
    media.parsed = true;
  }
}
</script>