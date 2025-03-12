<template>
  <section id="generator">
    <form ref="formRef">
      <h2 class="mb-4">Upload your files</h2>
      <label for="media">
        <p class="mb-4">Upload images, video and audio, then watch our generator create all the alternative media you need for your website.</p>
        <p>Be patient. If you're uploading a large video or audio file, it can take a few minutes to complete. Just remember, it's quicker than a human doing it.</p>
        <input class="border-b-2 border-white w-full lg:w-1/2 mt-8" id="media" type="file" accept="image/jpeg, image/png, image/webp, image/gif, video/*, audio/*" name="media" :disabled="generating" @change.prevent="parseFiles" />
      </label>
      <p v-if="error" class="font-bold text-red-500 py-4 text-left">
        ERROR: {{ error }}
      </p>
    </form>
    <table v-if="files.length" class="w-full mx-auto my-8 bg-white/5 rounded-2xl overflow-hidden border-collapse text-base lg:text-lg">
      <tbody>
        <tr v-for="file of files" :key="file.data.filename" :class="{ 'border-b-2 border-white': files.length > 1 }">
          <td class="py-4 px-4 lg:py-5 lg:px-6 w-auto max-w-[20ch] lg:max-w-none overflow-hidden">
            {{ file.data.name }}
          </td>
          <td class="py-4 px-4 lg:py-5 lg:px-6">
            <div class="flex flex-row items-center">
              <span class="leading-none">{{ file.status }}</span><Loader2 v-if="!file.result" class="w-4 h-4 -mt-1 ml-2 animate-spin" />
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
</template>

<script setup>
// Module Imports
import { ref, onMounted } from 'vue';
import { useToast } from '@/components/ui/toast/use-toast';
import { createClient } from '@supabase/supabase-js';

// Component Imports
import { Loader2, Copy, Download } from 'lucide-vue-next';

// User
import { useAuthStore } from '~/stores/AuthStore';
const { getUser } = useAuthStore();
const user = computed(() => getUser());

// Error Handling
const error = ref();

// Supabase
const supabase = ref();
onMounted(async () => {
  const { supabaseUrl, supabaseKey } = await $fetch('/api/supabase/getPublicCreds');
  supabase.value = createClient(supabaseUrl, supabaseKey);
})

// File Parsing Form
const formRef = ref(null);
const generating = ref(false);
const files = ref([]);

const resetGenerator = (e) => {
  formRef.value.reset();
  generating.value = false;
  error.value = undefined;
}

// Usage
const checkUsage = async (fileType) => {
  if (!user.value) {
    const usage = localStorage.getItem('awm_anon_usage');
    if (usage) {
      const { date, count } = JSON.parse(usage);
      if (new Date(Date.now()).getMonth() === new Date(date).getMonth() && count >= 10) throw { statusMessage: 'Sign up for access to more than 10 generations per month.' };
    }
  } else {
    const usage = await $fetch('/api/user/getUsage');
    if (!usage.length) return;

    await $fetch('/api/user/checkUsage', { method: 'POST', body: { usage: usage[0], fileType, user: user.value.id } });
    return;
  }
}

const updateUsage = async (fileType) => {
  if (!user.value) {
    const usage = localStorage.getItem('awm_anon_usage');
    if (usage) {
      const { count } = JSON.parse(usage);
      localStorage.setItem('awm_anon_usage', JSON.stringify({ date: Date.now(), count: count + 1 }));
    } else {
      localStorage.setItem('awm_anon_usage', JSON.stringify({ date: Date.now(), count: 1 }));
    }
  } else {
    await $fetch('/api/user/updateUsage', { method: 'POST', body: { fileType: fileType } });
  }
}

const parseFiles = async (e) => {
  try {
    if (user.value) await $fetch('/api/auth/verify');

    const formData = new FormData(formRef.value);
    files.value = [...formData.getAll('media')].map((file) => ({ data: file, result: null, status: 'Queued' }));
    
    generating.value = true;
    
    for (const file of files.value) {
      if (!user.value && !file.data.type.includes('image')) throw { statusMessage: 'Sign up for access to audio transcription and video captions.' };
      // Check if user is signed in and whether they have hit their usage limit
      await checkUsage(file.data.type);
      
      const form = new FormData();
      form.append('media', file.data);
      file.status = 'Parsing';
      
      if (file.data.type.includes('image')) {
        file.result = await $fetch('/api/images/getAltText', { method: 'POST', body: form });
        await updateUsage(file.data.type);
        file.status = 'Completed'
      }
      if (file.data.type.includes('video')) {
        await fetch('/.netlify/functions/generate-video-captions-background', { method: 'POST', body: form });
        const newChannel = supabase.value
          .channel('file-uploads')
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'file_uploads' },
            async (payload) => {
              const { file_path } = payload.new;
              if (file_path.includes(user.value.id) && file_path.includes(file.data.name.split('.')[0])) {
                file.result = await $fetch('/api/video/getDownloadUrl', { method: 'POST', body: {path: file_path } });
                supabase.value.removeChannel(newChannel);
                file.status = 'Completed';
                await updateUsage(file.data.type);
              }
            }
          )
          .subscribe();
      }
      if (file.data.type.includes('audio')) {
        await fetch('/.netlify/functions/generate-audio-transcript-background', { method: 'POST', body: form });
        const newChannel = supabase.value
          .channel('file-uploads')
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'file_uploads' },
            async (payload) => {
              const { file_path } = payload.new;
              if (file_path.includes(user.value.id) && file_path.includes(file.data.name.split('.')[0])) {
                file.result = await $fetch('/api/audio/getDownloadUrl', { method: 'POST', body: {path: file_path } });
                supabase.value.removeChannel(newChannel);
                file.status = 'Completed';
                await updateUsage(file.data.type);
              }
            }
          )
          .subscribe();
      }

    }
  } catch (err) {
    if (err.statusCode === 400) {
      error.value = 'Usage exceeded.';
    } else {
      error.value = err.statusMessage;
    }
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