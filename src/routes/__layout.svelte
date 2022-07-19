<script lang="ts">
  import { Toy } from '@leveluptuts/svelte-toy';
  import Header from '$lib/components/header/Header.svelte';
  import Loading from '$lib/components/loading.svelte';
  import Transition from '$lib/components/transition/index.svelte';
  import Portal from '$lib/Portal.svelte';
  import { boredState } from '$lib/stores/boredState';
  // import 'carbon-components-svelte/css/all.css';
  import '$root/styles/styles.scss';

  const dev = process.env.NODE_ENV !== 'production';
</script>

{#if dev}
  <Toy register={{ boredState }} />
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
        <a href="https://www.flaticon.com/free-icons/board-game" title="board game icons"
          >Board game icons created by Freepik - Flaticon</a
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
</Transition>

<style lang="scss">
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
    padding: 1rem;
    width: 100%;
    max-width: 1024px;
    margin: 0 auto;
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
