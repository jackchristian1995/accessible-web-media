<template>
  <div>
    <header class="pb-10">
      <h1 class="mb-5">Accessible Web Media</h1>
      <h2>Effortless accessibility for website media.</h2>
    </header>
    <main class="xl:w-4/5">
      <section>
        <p>To reach WCAG’s minimum accessibility level (WCAG Level A), you need alternative text for all images, captions for all pre-recorded video and transcripts for pre-recorded audio.</p>
        <p>Accessible Web Media is a one-stop shop to create alternative text, video captions and audio transcripts. We make web media accessibility easy and hassle-free.</p>
      </section>
      <section>
        <h3>What media do you need to make accessible?</h3>
        <ul class="flex flex-row items-center justify-start space-x-8">
          <li>
            <nuxt-link class="cta" to="/image-alt-text-generator">Images</nuxt-link>
          </li>
          <li>
            <nuxt-link class="cta" to="/video-caption-generator">Video</nuxt-link>
          </li>
          <li>
            <nuxt-link class="cta" to="/audio-transcription-generator">Audio</nuxt-link>
          </li>
        </ul>
      </section>
    </main>
  </div>
</template>

<script setup>
</script>