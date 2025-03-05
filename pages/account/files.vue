<template>
  <div>
    <section>
      <h2>Transcripts</h2>
      <ul>
        <li v-for="transcript of transcripts" :key="transcript.id">
          {{ transcript.name }}
          <button class="cta" @click.prevent="downloadTranscript(caption.name)">Download</button>
        </li>
      </ul>
    </section>
    <section>
      <h2>Captions</h2>
      <ul>
        <li v-for="caption of captions" :key="caption.id">
          {{ caption.name }}
          <button class="cta" @click.prevent="downloadCaptions(caption.name)">Download</button>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
// Module Imports
import { onMounted, ref } from 'vue';

// File lists
const transcripts = ref([]);
const captions = ref([]);

onMounted(async () => {
  transcripts.value = await $fetch('/api/audio/listTranscripts');
  captions.value = await $fetch('/api/video/listCaptions');
});

const downloadCaptions = async (filename) => {
  try {
    const downloadLink = await $fetch('/api/video/downloadCaptions', { method: 'POST', body: { filename } });
    window.open(downloadLink, '_blank');
  } catch (error) {
    console.error(error.message);
  }
}

const downloadTranscript = async (filename) => {
  try {
    const downloadLink = await $fetch('/api/audio/downloadTranscript', { method: 'POST', body: { filename } });
    window.open(downloadLink, '_blank');
  } catch (error) {
    console.error(error.message);
  }
}
</script>