import { defineStore } from "pinia";

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref()

  // Actions (Getters)
  const getUser = () => user.value;

  // Actions (Setters)
  const setUser = (payload) => user.value = payload;

  return { user, getUser, setUser }
}, {
  persist: true
});