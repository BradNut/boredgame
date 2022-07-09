<script lang="ts">
  import Header from '$lib/components/header/Header.svelte';
  import Transition from '$lib/components/transition/index.svelte';
  // import 'carbon-components-svelte/css/all.css';
  import '$root/styles/styles.scss';
</script>

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
        <a href="https://www.flaticon.com/free-icons/board-game" title="board game icons">Board game icons created by Freepik - Flaticon</a>
      </p>
    </footer>
  </div>
</Transition>

<style>
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
