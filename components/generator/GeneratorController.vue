<template>
  <div>
    <section>
      <p v-if="error" class="font-bold text-red-500 py-4 text-center">
        ERROR: {{ error }}
      </p>
      <form ref="formRef" class="lg:w-2/3">
        <label for="">
          <h2 class="mb-4">Upload your files</h2>
          <p class="mb-4">Upload images, video and audio, then watch our generator create all the alternative media you need for your website.</p>
          <p v-if="generating" class="mb-8">Be patient. If you're uploading a large video or audio file, it can take a few minutes to complete. Just remember, it's cheaper and quikcer than human doing it.</p>
          <input class="border-b-2 border-white w-full" type="file" accept="image/jpeg, image/png, image/webp, image/gif, video/*, audio/*" name="media" :disabled="generating" multiple @change.prevent="parseFiles" />
        </label>
      </form>
      <table v-if="files.length" class="w-full mx-auto my-8 bg-white/5 rounded-2xl overflow-hidden border-collapse text-base lg:text-lg">
        <tbody>
          <tr v-for="file of files" :key="file.data.filename" :class="{ 'border-b-2 border-white': files.length > 1 }">
            <td class="py-4 px-4 lg:py-5 lg:px-6 w-full max-w-[20ch] lg:max-w-none overflow-hidden">
              {{ file.data.name }}
            </td>
            <td v-if="file.status !== 'Completed'" class="py-4 px-4 lg:py-5 lg:px-6">
              <div class="flex flex-row items-center">
                <span class="leading-none">{{ file.status }}</span><Loader2 v-if="file.status !== 'Completed'" class="w-4 h-4 -mt-1 ml-2 animate-spin" />
              </div>
            </td>
            <td v-if="file.data.type.includes('image')" class="flex w-full flex-row items-center justify-between space-x-4 py-4 px-2 lg:py-5 lg:px-6 w-full">
              <span>
                {{ file.result }}
              </span>
              <button v-if="file.result" aria-label="Copy alt text" @click.prevent="addToClipboard(file.result)">
                <Copy class="w-6 h-6 ml-8" />
              </button>
            </td>
            <td v-else class="py-4 px-4 lg:py-5 lg:px-6 text-right">
              <a :class="['inline-block', { 'opacity-50 pointer-events-none': !file.result }]" :href="file.result" target="_blank" download>
                <Download class="w-6 h-6" />
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup>
// Module Imports
import { ref } from 'vue';
import { useToast } from '@/components/ui/toast/use-toast';

// Component Imports
import { Loader2, Copy, Download } from 'lucide-vue-next';

// Props
const props = defineProps({
  loadingMessage: {
    type: String,
    required: false,
    default: 'Loading...'
  }
});

// Error Handling
const error = ref();

// File Parsing Form
const formRef = ref(null);
const generating = ref(false);
const files = ref([]);

const resetGenerator = (e) => {
  console.log('resetting');
  
  formRef.value.reset();
  generating.value = false;
  error.value = undefined;
}

const parseFiles = async (e) => {
  try {
    const formData = new FormData(formRef.value);
    files.value = [...formData.getAll('media')].map((file) => ({ data: file, result: null, status: 'Queued' }));
    
    generating.value = true;
    
    for (const file of files.value) {
      const form = new FormData()
      form.append('media', file.data);
      file.status = 'Parsing';
      
      if (file.data.type.includes('image')) file.result = await $fetch('/api/images/getAltText', { method: 'POST', body: form });
      if (file.data.type.includes('video')) file.result = await $fetch('/api/video/getCaptions', { method: 'POST', body: form });
      if (file.data.type.includes('audio')) file.result = await $fetch('/api/audio/getTranscript', { method: 'POST', body: form });
      file.status = 'Completed';
    }
  } catch (err) {
    error.value = err.statusMessage;
    files.value = [];
  } finally {
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