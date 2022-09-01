import type { BoredStore, Dialog } from '$lib/types';
import { writable } from 'svelte/store';
import DefaultDialog from '../components/dialog/DefaultDialog.svelte';
// import { BoredStore } from '$lib/types';

// Custom store
const state = () => {
  const initialDialog: Dialog = {
    isOpen: false,
    content: DefaultDialog
  }
  const initial = { loading: false, dialog: initialDialog }
  const { subscribe, set, update } = writable<BoredStore>(initial);

  function clear() {
    set(initial);
  }

  return { subscribe, set, update, clear };
};

export const boredState = state();
