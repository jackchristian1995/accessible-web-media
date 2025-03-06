<template>
  <div>
    <section>
      <h1 class="text-xl">{{ user.email }}</h1>
      <Dialog>
        <DialogTrigger class="cta">
          Delete Account
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle class="text-red-600 font-bold text-2xl">
              DANGER AREA
            </DialogTitle>
            <DialogDescription>
              There is no going back once your account is deleted. All your files and data will be gone - FOREVER.
            </DialogDescription>
            <DialogFooter>
              <DialogClose as-child>
                <button class="cta border-red-600 text-red-600 hover:bg-red-600 hover:text-white mr-auto" @click.prevent="deleteAccount">Delete account</button>
              </DialogClose>
            </DialogFooter>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
    <file-list />
  </div>
</template>

<script setup>
// Module Imports
import { computed } from 'vue';

// Component Imports
import FileList from '~/components/account/FileList.vue';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '~/components/ui/dialog';

// User
import { useAuthStore } from '~/stores/AuthStore';
const { getUser, setUser } = useAuthStore();

const user = computed(() => getUser());

// Delete Account
const deleteAccount = async () => {
  try {
    await $fetch('/api/auth/verify');
    await $fetch('/api/audio/deleteTranscripts');
    await $fetch('/api/video/deleteCaptions');
    await $fetch('/api/auth/deleteAccount');
    setUser(undefined);
    window.location.assign('/');
  } catch (error) {
    console.error(error.message);
  }
}
</script>