<script lang="ts">
  import Header from '$lib/header/Header.svelte';
  // import 'carbon-components-svelte/css/all.css';
  import '$root/styles/styles.scss';
</script>

<div class="fade" style:animation-duration="250ms" style:animation-delay="250ms">
  <Header />
  <main>
    <slot />
  </main>
  <footer>
    <p>Built by <a target="__blank" href="https://bradleyshellnut.com">Bradley Shellnut</a></p>
    <p>
      <a href="https://www.flaticon.com/free-icons/board-game" title="board game icons">Board game icons created by Freepik - Flaticon</a>
    </p>
  </footer>
</div>

<style>
  .fade {
    display: grid;
    grid-template-rows: auto 1fr auto;
    min-height: 100vh;
    animation-name: fadeIn;
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
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
