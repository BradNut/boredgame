import { writable } from 'svelte/store';
import type { ToastData } from '$lib/types';
import { ToastType } from '$lib/types';

// Custom store
const newToast = () => {
  const { subscribe, update } = writable<ToastData[]>([]);

  function send(
    message: string,
    {
      duration = 2000,
      type = ToastType.INFO,
      autoDismiss = true,
      dismissible = false,
      showButton = false
    } = {}
  ) {
    const id = Math.floor(Math.random() * 1000);

    const newMessage: ToastData = {
      id,
      duration,
      autoDismiss,
      dismissible,
      showButton,
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
