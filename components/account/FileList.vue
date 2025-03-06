<template>
  <section class="w-full">
    <header class="pb-16 mb-16 border-b-2 border-white">
      <h2 class="mb-4">Your files</h2>
      <p class="mb-0">Download all your old audio transcripts and video captions.</p>
    </header>
    <div class="w-full mb-16">
      <h3 class="mb-8">Transcripts</h3>
      <table class="w-full mx-auto my-8 bg-white/5 rounded-2xl overflow-hidden border-collapse text-base lg:text-lg">
        <tbody>
          <tr v-for="file of transcripts" :key="file.id">
            <td class="py-4 px-4 lg:py-5 lg:px-6 w-full max-w-[20ch] lg:max-w-none overflow-hidden">
              {{ file.name }}
            </td>
            <td class="py-4 px-4 lg:py-5 lg:px-6 text-right">
              <button @click.prevent="downloadTranscript(file.name)">
                <Download class="w-6 h-6" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="w-full">
      <h3 class="mb-8">Captions</h3>
      <table class="w-full mx-auto my-8 bg-white/5 rounded-2xl overflow-hidden border-collapse text-base lg:text-lg">
        <tbody>
          <tr v-for="file of captions" :key="file.id">
            <td class="py-4 px-4 lg:py-5 lg:px-6 w-full max-w-[20ch] lg:max-w-none overflow-hidden">
              {{ file.name }}
            </td>
            <td class="py-4 px-4 lg:py-5 lg:px-6 text-right">
              <button @click.prevent="downloadCaptions(file.name)">
                <Download class="w-6 h-6" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
// Module Imports
import { onMounted, ref } from 'vue';

// Component Imports
import { Download } from 'lucide-vue-next';

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