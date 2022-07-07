import type { ToastData } from '$lib/types';
import { writable } from 'svelte/store';

// Custom store
const newToast = () => {
  const { subscribe, update } = writable([]);

  function send(message: string, { duration = 2000, type = 'INFO' } = {}) {
    const id = Math.floor(Math.random() * 1000);
    const newMessage = {
      id,
      duration,
      type,
      message
    };
    update((store) => [...store, newMessage]);
  }

  function remove(id: number) {
    update((store) => {
      const newStore = store.filter((item: ToastData) => item.id !== id);
      return [...newStore];
    });
  }

  return { subscribe, send, remove };
};

export const toast = newToast();
