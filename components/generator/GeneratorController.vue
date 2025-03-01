<template>
  <div class="w-full relative">
    <section :class="['relative', { 'opacity-0': generating }]">
      <p v-if="error" class="font-bold text-red-500 py-4 text-center">
        ERROR: {{ error }}
      </p>
      <div ref="dropAreaRef" id="drop-area" class="w-3/4 mx-auto h-[50vh] rounded-3xl border-2 border-white bg-white/5 relative" @drop.prevent="handleDrop" @dragover.prevent="handleDrag" @dragleave.prevent="handleDragExit">
        <span class="block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold md:text-lg select-none">
          Drop your files here
        </span>
      </div>
    </section>
    <section v-if="generating" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex flex-col items-center justify-center">
      <header v-if="completedFiles !== files.length" class="py-10">
        <Loader2 class="w-8 h-8 block mx-auto mb-8 animate-spin" />
        <p class="font-bold">{{ loadingMessage }}</p>
      </header>
      <header v-else class="py-10">
        <h2 class="text-center mb-4">All done!</h2>
        <p class="text-center">You’re files are ready to go. We recommend proofreading before using the results in production.</p>
      </header>
      <main class="flex flex-col items-center justify-start w-full xl:w-4/5">
        <table class="w-full mx-auto bg-white/5 rounded-2xl overflow-hidden border-collapse">
          <tbody>
            <tr v-for="file of files" :key="file.data.filename" :class="{ 'border-b-2 border-white': files.length > 1 }">
              <td class="py-5 px-6">
                {{ file.data.name }}
              </td>
              <td class="py-5 px-6">
                {{ file.status }}
              </td>
              <td v-if="mediaType === 'video' || mediaType === 'audio'" class="flex flex-row items-center justify-between space-x-4 py-5 px-6">
                <a :class="['cta', { 'opacity-50 pointer-events-none': !file.result }]" :href="file.result" target="_blank" download>Download</a>
              </td>
              <td v-if="mediaType === 'image'" class="flex flex-row items-center justify-between space-x-4 py-5 px-6 w-full">
                <span>
                  {{ file.result }}
                </span>
                <button v-if="file.result" aria-label="Copy alt text" @click.prevent="addToClipboard(file.result)">
                  <Copy class="w-6 h-6 ml-8" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <button class="cta my-8 mx-auto" @click.prevent="resetGenerator">
          Restart
        </button>
      </main>
    </section>
  </div>
</template>

<script setup>
// Module Imports
import { ref } from 'vue';
import { useToast } from '@/components/ui/toast/use-toast';

// Component Imports
import { Loader2, Copy } from 'lucide-vue-next';

// Props
const props = defineProps({
  mediaType: {
    type: String,
    required: true
  },
  loadingMessage: {
    type: String,
    required: false,
    default: 'Loading...'
  }
});

// Error Handling
const error = ref();

// Drag and Drop
const dropAreaRef = ref(null);
const generating = ref(false);
const files = ref([]);
const completedFiles = computed(() => files.value.filter((file) => file.result).length);

const resetGenerator = (e) => {
  generating.value = false;
  files.value = [];
  error.value = undefined;
}

const handleDrag = (e) => {
  dropAreaRef.value.classList.remove('bg-white/5');
  dropAreaRef.value.classList.add('bg-white/15');
}

const handleDragExit = (e) => {
  dropAreaRef.value.classList.remove('bg-white/15');
  dropAreaRef.value.classList.add('bg-white/5');
}

const handleDrop = async (e) => {
  handleDragExit()
  try {
    if (e.dataTransfer.items) {
      generating.value = true;
      files.value = [...e.dataTransfer.items].filter((item) => item.kind === 'file' && item.type.includes(props.mediaType)).map((item) => ({ data: item.getAsFile(), result: null, status: 'Queued' }));
      
      for (const file of files.value) {
        const form = new FormData()
        form.append('media', file.data);
        file.status = 'Parsing';
        
        if (file.data.type.includes('image')) file.result = await $fetch('/api/images/getAltText', { method: 'POST', body: form });
        if (file.data.type.includes('video')) file.result = await $fetch('/api/video/getCaptions', { method: 'POST', body: form });
        if (file.data.type.includes('audio')) file.result = await $fetch('/api/audio/getTranscript', { method: 'POST', body: form });
        file.status = 'Completed';
      }
    }
  } catch (err) {
    error.value = err.message;

    setTimeout(resetGenerator, 5000);
  }
}

// Copy to Clipboard
const { toast } = useToast();
const addToClipboard = (string) => {
  navigator.clipboard.writeText(string)
  toast({
    title: 'Copied.',
    description: `Copied '${string}' to clipboard.`
  });
}
</script>