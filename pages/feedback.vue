<template>
  <div>
    <section class="pb-16 mb-16 border-b-2 border-white">
      <h1 class="mb-4">Your feedback</h1>
      <p>We are constantly looking to improve Accessible Web Media. With your help we can identify pain points and things to improve so that we can make it the best accessibility tool in the world.</p>
      <p class="mb-0">Complete the form below to give feedback and help grow Accessible Web Media.</p>
    </section>
    <form action="/api/feedback/postFeedback" method="POST" enctype="application/x-www-form-urlencoded" class="pb-16">
      <fieldset class="flex flex-col space-y-8 lg:space-y-0 lg:flex-row justify-between items-start mb-8">
        <label class="w-full lg:w-[47.5%]" for="profession">
          <p class="mb-2">What is your profession?</p>
          <select name="profession" id="profession">
            <option value="Developer">Developer</option>
            <option value="Designer">Designer</option>
            <option value="Marketer">Marketer</option>
            <option value="Entrepreneur">Entrepreneur</option>
            <option value="Copywriter">Copywriter</option>
            <option value="Other">Other</option>
          </select>
        </label>
        <label class="w-full lg:w-[47.5%]" for="useful">
          <p class="mb-2">Is Accessible Web Media a tool you would find useful?</p>
          <select name="useful" id="useful">
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
      </fieldset>
      <fieldset class="flex flex-col space-y-8 lg:space-y-0 lg:flex-row justify-between items-start mb-8">
        <label class="w-full lg:w-[47.5%]" for="preferred_tool">
          <p class="mb-2">Which generator are you most likely to use for your website?</p>
          <select name="preferred_tool" id="preferred_tool">
            <option value="Alt Text Generator">Alt Text Generator</option>
            <option value="Video Caption Generator">Video Caption Generator</option>
            <option value="Audio Transcription Generator">Audio Transcription Generator</option>
            <option value="All">All Of Them</option>
          </select>
        </label>
        <label class="w-full lg:w-[47.5%]" for="would_pay">
          <p class="mb-2">As Accessible Web Media grows and improves, is it a tool you would consider paying a small subscription fee to use?</p>
          <select name="would_pay" id="would_pay">
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
      </fieldset>
      <fieldset class="mb-8">
        <label class="w-full" for="works_well">
          <p class="mb-2">What do you like about Accessible Web Media?</p>
          <textarea name="works_well" id="works_well" class="w-full h-36 no-resize" required></textarea>
        </label>
      </fieldset>
      <fieldset class="mb-8">
        <label class="w-full" for="can_improve">
          <p class="mb-2">What could we improve about Accessible Web Media?</p>
          <textarea name="can_improve" id="can_improve" class="w-full h-36 no-resize" required></textarea>
        </label>
      </fieldset>
      <fieldset class="flex flex-col space-y-8 lg:space-y-0 lg:flex-row justify-between items-start mb-8">
        <label class="w-full lg:w-[47.5%]" for="accessibility_knowledge">
          <p class="mb-2">Would you be interested in understanding more about the importance of web accessibility and how to implement it on your website?</p>
          <select name="accessibility_knowledge" id="accessibility_knowledge">
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
        <label class="w-full lg:w-[47.5%]" for="receive_updates">
          <p class="mb-2">Are you interested in receiving updates about new features and launches as Accessible Web Media grows?</p>
          <select name="receive_updates" id="receive_updates">
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
      </fieldset>
      <input type="hidden" name="user" :value="user.id" />
      <button type="submit" class="cta">Send Feedback</button>
    </form>
  </div>
</template>

<script setup>
// Module Imports
import { computed } from 'vue';

// Store Imports
import { useAuthStore } from '~/stores/AuthStore';

// User
const { getUser } = useAuthStore();
const user = computed(() => getUser());
</script>