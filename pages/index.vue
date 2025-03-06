<template>
  <div class="flex flex-col items-start justify-between pb-16">
    <section class="w-full pb-16 mb-16 border-b-2 border-white">
      <div>
        <img src="/accessible-web-media-logo.svg" alt="Accessible Web Media" class="block mb-8 lg:mb-8 w-[95%] sm:w-4/5 lg:w-1/3 h-auto" width="300" height="20" />
        <h1 class="mb-8">Effortless accessibility for website media.</h1>
        <p>To reach WCAG’s minimum accessibility level (WCAG Level A), you need alternative text for all images, captions for all pre-recorded video and transcripts for pre-recorded audio.</p>
        <p class="mb-0">Accessible Web Media is a one-stop shop to create alternative text, video captions and audio transcripts. We make web media accessibility easy and hassle-free.</p>
      </div>
    </section>
    <generator-controller class="w-full" />
  </div>
</template>

<script setup>
import GeneratorController from '~/components/generator/GeneratorController.vue';
</script>