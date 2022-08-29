<script lang="ts">
  import { browser } from '$app/environment';
  import { fade } from 'svelte/transition';
  import { navigating } from '$app/stores';
  import debounce from 'just-debounce-it';
  import { Toy } from '@leveluptuts/svelte-toy';
  import {
    Dialog,
    DialogOverlay,
    DialogTitle,
    DialogDescription
  } from '@rgossiaux/svelte-headlessui';
  import Header from '$lib/components/header/Header.svelte';
  import Loading from '$lib/components/loading.svelte';
  import Transition from '$lib/components/transition/index.svelte';
  import Portal from '$lib/Portal.svelte';
  import { boredState } from '$lib/stores/boredState';
  import { collectionStore } from '$lib/stores/collectionStore';
  import { gameStore } from '$lib/stores/gameSearchStore';
  import { toast } from '$lib/components/toast/toast';
  import Toast from '$lib/components/toast/Toast.svelte';
  import '$root/styles/styles.scss';

  $: {
    if ($navigating) {
      debounce(() => {
        boredState.set({ loading: true, dialogOpen: false });
      }, 250);
    }
    if (!$navigating) {
      boredState.set({ loading: false, dialogOpen: false });
    }
  }

  if (browser) {
    let collectionEmpty = $collectionStore.length === 0 || false;
    console.log('collectionEmpty', collectionEmpty);
    console.log('localStorage.collection', localStorage.collection);
    if (collectionEmpty && localStorage?.collection && localStorage?.collection?.length !== 0) {
      const collection = JSON.parse(localStorage.collection);
      console.log('collection', collection);
      if (collection?.length !== 0) {
        collectionStore.addAll(collection);
      }
    }
  }

  const dev = process.env.NODE_ENV !== 'production';
</script>

{#if dev}
  <Toy register={{ boredState, collectionStore, gameStore, toast }} />
{/if}
<Transition transition={{ type: 'fade', duration: 250 }}>
  <div class="wrapper">
    <Header />
    <Transition transition={{ type: 'page' }}>
      <main>
        <slot />
      </main>
    </Transition>
    <footer>
      <p>Built by <a target="__blank" href="https://bradleyshellnut.com">Bradley Shellnut</a></p>
      <p>
        <a
          target="__blank"
          href="https://www.flaticon.com/free-icons/board-game"
          title="board game icons">Board game icons created by Freepik - Flaticon</a
        >
      </p>
    </footer>
  </div>
  {#if $boredState?.loading}
    <Portal>
      <Transition transition={{ type: 'fade', duration: 0 }}>
        <div class="loading">
          <Loading />
          <h3>Loading...</h3>
        </div>
      </Transition>
      <div class="background" />
    </Portal>
  {/if}
  {#if $boredState?.dialogOpen}
    <div transition:fade>
      <Dialog
        open={$boredState?.dialogOpen}
        on:close={() => boredState.set({ loading: false, dialogOpen: false })}
        static
      >
        <DialogOverlay
          style={'position: fixed; inset: 0; z-index: 100; background-color: rgb(0 0 0); opacity: 0.3;'}
        />
        <div class="dialog">
          <DialogTitle>Deactivate account</DialogTitle>
          <DialogDescription>This will permanently deactivate your account</DialogDescription>

          <p>
            Are you sure you want to deactivate your account? All of your data will be permanently
            removed. This action cannot be undone.
          </p>

          <button on:click={() => boredState.set({ loading: false, dialogOpen: false })}
            >Deactivate</button
          >
          <button on:click={() => boredState.set({ loading: false, dialogOpen: false })}
            >Cancel</button
          >
        </div>
      </Dialog>
    </div>
  {/if}
  <Toast />
</Transition>

<style lang="scss">
  :global(.dialog) {
    position: fixed;
    top: 25%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 101;
    border-radius: 10px;
    background-color: var(--primary);
    padding: 2rem;
    /* max-width: 400px; */
  }

  .loading {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 101;
    display: grid;
    place-items: center;
    gap: 1rem;

    h3 {
      color: white;
    }
  }

  .background {
    background: black;
    opacity: 0.8;
    cursor: none;
    inset: 0;
    position: fixed;
    z-index: 100;
  }

  .wrapper {
    display: grid;
    grid-template-rows: auto 1fr auto;
    min-height: 100vh;
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    max-width: 850px;
    margin: 0 auto;
    padding: 2rem 0rem;
    max-width: 80%;

    @media (min-width: 1500px) {
      max-width: 60%;
    }
    box-sizing: border-box;
  }

  footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px;
  }

  footer a {
    font-weight: bold;
  }

  @media (min-width: 480px) {
    footer {
      padding: 40px 0;
    }
  }
</style>
