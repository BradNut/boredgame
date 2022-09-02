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
  const initial: BoredStore = {
    loading: false, dialog: initialDialog, search: {
      totalCount: 1,
      pageSize: 25,
      skip: 0,
      currentPage: 1
    }
  };
  const { subscribe, set, update } = writable<BoredStore>(initial);

  function clear() {
    set(initial);
  }

  return { subscribe, set, update, clear };
};

export const boredState = state();
