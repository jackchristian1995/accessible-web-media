<template>
  <div class="w-full relative">
    <section :class="['relative', { 'opacity-0': generating || completed }]">
      <p v-if="error" class="font-bold text-red-500 py-4 text-center">
        ERROR: {{ error }}
      </p>
      <div ref="dropAreaRef" id="drop-area" class="w-3/4 mx-auto h-[50vh] rounded-3xl border-2 border-white bg-white/5 relative" @drop.prevent="handleDrop" @dragover.prevent="handleDrag">
        <span class="block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold md:text-lg select-none">
          Drop your files here
        </span>
      </div>
    </section>
    <section v-if="generating" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex flex-col items-center justify-center space-y-8">
      <Loader2 class="w-8 h-8 animate-spin" />
      <p class="font-bold">{{ loadingMessage }}</p>
    </section>
    <section v-if="!generating && completed" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
      <ul>
        <li v-for="file of files" :key="file.filename">
          {{ file.altText }}
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
const completed = ref(false);
const files = ref([]);

// const handleDrag = (e) => {
//   console.log(e);
// }

const handleDrop = async (e) => {
  try {
    if (e.dataTransfer.items) {
      generating.value = true;
      files.value = [...e.dataTransfer.items].filter((item) => item.kind === 'file' && item.type.includes(props.mediaType)).map((item) => ({ data: item.getAsFile(), altText: null }));
      
      for (const file of files.value) {
        const form = new FormData()
        form.append('media', file.data);

        file.altText = await $fetch('/api/images/getAltText', { method: 'POST', body: form });
      }
      completed.value = true;
    }
  } catch (err) {
    error.value = err.message;

    setTimeout(() => {
      error.value = undefined;
    }, 5000);
  } finally {
    generating.value = false;
  }
}
</script>