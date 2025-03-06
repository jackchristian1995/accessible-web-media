<template>
  <div>
    <file-list />
    <section class="mt-16 py-16 border-t-2 border-red-500">
      <h2 class="text-red-500 mb-8">Danger Area</h2>
      <Dialog>
        <DialogTrigger class="cta border-red-500 text-red-500">
          Delete Account
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle class="text-red-600 font-bold text-2xl">
              Are you sure?
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