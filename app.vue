<template>
  <div class="w-full min-h-screen max-w-screen-2xl px-4 lg:px-6 mx-auto relative">
    <nav class="relative top-0 w-full">
      <div class="w-full flex flex-row justify-between items-center pt-4 pb-2 border-b-2 border-white">
        <nuxt-link to="/" class="h-full w-auto block">
          <img src="/accessible-web-media-logo-small.svg" alt="Accessible Web Media logo" class="w-auto h-5 block" />
        </nuxt-link>
        <div class="flex flex-row items-center justify-end space-x-8">
          <nuxt-link to="/account">Downloads</nuxt-link>
          <nuxt-link to="/feedback">Feedback</nuxt-link>
          <Dialog v-if="!user">
            <DialogTrigger>
              Sign in
            </DialogTrigger>
            <DialogContent class="text-gray-900">
              <DialogHeader>
                <DialogTitle class="mb-2 text-xl">
                  Sign into your account
                </DialogTitle>
                <DialogDescription class="text-gray-900">
                  We currently offer two ways to sign in using either your Google or Github account.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter class="flex sm:flex-col flex-col items-start space-y-4">
                <DialogClose as-child>
                  <button class="cta !bg-gray-800 !hover:bg-gray-900 text-white text-base flex flex-row justify-center items-center py-2 pl-4 pr-8 rounded-xl" @click.prevent="signInWithGithub">
                    <img class="w-auto h-6 mr-2" src="/icons/github-mark-white.svg" alt="Github logo">
                    <span>Sign in with Github</span>
                  </button>
                </DialogClose>
                <DialogClose as-child>
                  <button class="cta !bg-gray-800 !hover:bg-gray-900 text-white flex text-base flex-row justify-center items-center py-2 pl-4 pr-8 rounded-xl" @click.prevent="signInWithGoogle">
                    <img class="w-auto h-6 mr-2" src="/icons/web_dark_rd_na.svg" alt="Sign in with Google">
                    <span>Sign in with Google</span>
                  </button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <button v-else @click.prevent="logout">Logout</button>
        </div>
      </div>
    </nav>
    <div class="w-full pt-16">
      <nuxt-page />
    </div>
    <Toaster />
    <consent-form />
  </div>
</template>

<script setup>
// Module Imports
import { provide } from 'vue';

// Component Imports
import Toaster from '~/components/ui/toast/Toaster.vue';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from '~/components/ui/dialog';
import ConsentForm from './components/consent/ConsentForm.vue';

// Login
const signInWithGithub = async () => {
  const url = await $fetch('/api/auth/signInGithub', { method: 'POST', body: { redirectUrl: window.location.href } });
  window.location.href = url;  
}

const signInWithGoogle = async () => {
  const url = await $fetch('/api/auth/signInGoogle', { method: 'POST', body: { redirectUrl: window.location.href } });
  window.location.href = url;  
}

// User
import { useAuthStore } from '~/stores/AuthStore';
const { getUser, setUser } = useAuthStore();

const user = computed(() => getUser());
provide('user', user);

const logout = async () => {
  try {
    await $fetch('/api/auth/logout');
    setUser(undefined);
  } catch (error) {
    setUser(undefined);
  }
}

// Auth Redirect Flow
onMounted(async () => {
  const { hash, path } = useRoute();
  if (hash.includes('refresh_token')) {
    window.history.pushState({}, null, path);
    try {
      const userData = await $fetch('/api/auth/getSessionFromHash', { method: 'POST', body: { hash } });
      setUser(userData);
    } catch (err) {
      console.error(err);
    }
  }

});
</script>