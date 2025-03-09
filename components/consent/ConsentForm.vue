<template>
  <div>
    <button class="fixed bottom-2 right-2 cta p-0 flex flex-row items-center justify-center w-10 h-10 border-2 border-white" @click.prevent="toggleConsentForm" aria-label="Cookie consent toggle">
      <Cookie class="w-6 h-6" />
    </button>
    <teleport to="body">
      <div v-if="formOpen" class="fixed z-50 bottom-0 left-0 w-full bg-[#312E81] border-t-2 border-white">
        <div class="max-w-screen-2xl w-full px-6 py-6">
          <p class="text-center">We use cookies to improve your experience and analyze website traffic with Google Analytics. We do not use cookies without your consent. Please let us know below whether you consent to our use of cookies. You can learn more about how we use cookies in our <nuxt-link class="underline" to="/privacy-policy">Privacy Policy</nuxt-link>.</p>
          <div class="w-full flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-8 justify-center items-center">
            <button class="cta" @click.prevent="acceptCookies">Accept</button>
            <button class="cta" @click.prevent="rejectCookies">Reject</button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
// Module Imports
import { onMounted } from 'vue';

// Component Imports
import { Cookie } from 'lucide-vue-next';

// Consent controls
const formOpen = ref(false);

const toggleConsentForm = () => formOpen.value = !formOpen.value;

const storeConsent = (consent) => {
  localStorage.setItem('awm_cookie_consent', JSON.stringify({ date: Date.now(),  consent }));
}

const checkConsent = () => {
  const stored = localStorage.getItem('awm_cookie_consent');

  if (!stored) {
    toggleConsentForm();
    return;
  }

  const { date, consent } = JSON.parse(stored);
  const timeSinceConsent = Date.now() - date;
  const maxConsentTime = 30 * 24 * 60 * 60 * 1000;
  
  if (timeSinceConsent >= maxConsentTime) {
    toggleConsentForm();
    return;
  }

  updateGtag(consent);
}

onMounted(() => checkConsent());

const updateGtag = (consent) => {
  const { gtag } = useGtag();
  
  gtag('consent', 'update', {
    analytics_storage: consent
  });
}

const acceptCookies = () => {
  updateGtag('granted');
  storeConsent('granted');
  toggleConsentForm();
}

const rejectCookies = () => {
  updateGtag('denied');
  storeConsent('denied');
  toggleConsentForm();
}
</script>