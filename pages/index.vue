<template>
  <div class="flex flex-col items-start justify-between pb-16">
    <section class="w-full pb-16 mb-16 border-b-2 border-white">
      <div>
        <img src="/accessible-web-media-logo.svg" alt="Accessible Web Media" class="block mb-8 lg:mb-8 w-[95%] sm:w-4/5 lg:w-1/3 h-auto" width="300" height="20" />
        <h1 class="mb-8">Effortless accessibility for website media.</h1>
        <p>To reach WCAG’s minimum accessibility level (WCAG Level A), you need alternative text for all images, captions for all pre-recorded video and transcripts for pre-recorded audio.</p>
        <p>Accessible Web Media is a one-stop shop to create alternative text, video captions and audio transcripts. We make web media accessibility easy and hassle-free.</p>
        <a class="cta mt-2 inline-block" href="#generator">Get started</a>
      </div>
    </section>
    <section class="w-full pb-16 mb-16 border-b-2 border-white">
      <h2 class="mb-8">Usage Limits</h2>
      <p>For now, Accessible Web Media is a free tool. It is independently built and funded by <a class="underline" href="https://jackchristian.com.au/" target="_blank">Jack Christian</a>.</p>
      <p>With this in mind, users are limited to 10 image alt text generations and 1 video captions or audio transcription job per month.</p>
      <p class="uppercase px-2 py-4 border-2 border-white inline-block"><strong>You can permanently extend your usage limit to 50 alt text and 10 video/audio jobs per month by completing our <nuxt-link class="underline" to="/feedback">feedback form</nuxt-link>.</strong></p>
    </section>
    <generator-controller class="w-full" />
  </div>
</template>

<script setup>
import GeneratorController from '~/components/generator/GeneratorController.vue';
</script>