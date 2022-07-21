<script lang="ts">
  // import {
  //   Theme,
  //   RadioButtonGroup,
  //   RadioButton,
  // } from "carbon-components-svelte";
  // import type { CarbonTheme } from "carbon-components-svelte/types/Theme/Theme.svelte";
  import { page } from '$app/stores';
  import Themes from '$lib/components/preferences/themes.svelte';
  import logo from './bored-game.png';

  // let theme: CarbonTheme = "white";
</script>

<header>
  <div class="corner">
    <a href="/">
      <img src={logo} alt="Bored Game Home" />
    </a>
  </div>

  <nav>
    <!-- <ul>
      <li class:active={$page.url.pathname === '/'}><a sveltekit:prefetch href="/">Home</a></li>
      <li class:active={$page.url.pathname === '/about'}>
        <a sveltekit:prefetch href="/about">About</a>
      </li>
    </ul> -->
    <div><Themes /></div>
  </nav>
</header>

<style lang="scss">
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: var(--level-2);
    padding: 0 var(--containerPadding);
    font-size: 1.6rem;

    @media (max-width: 1000px) {
      padding-top: 1.25rem;
    }

    @media (max-width: 650px) {
      align-content: center;
      display: grid;
      justify-items: center;
      grid-template-columns: 1fr;
    }
    /* max-width: 1000px; */
  }

  .corner {
    width: 3em;
    height: 3em;
  }

  .corner a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .corner img {
    width: 2em;
    height: 2em;
    object-fit: contain;
  }

  nav {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 1rem;
    --background: rgba(255, 255, 255, 0.7);
  }

  svg {
    width: 2em;
    height: 3em;
    display: block;
  }

  path {
    fill: var(--background);
  }

  ul {
    position: relative;
    padding: 0;
    margin: 0;
    height: 3em;
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
    background: var(--background);
    background-size: contain;
  }

  li {
    position: relative;
    height: 100%;
  }

  li.active::before {
    --size: 6px;
    content: '';
    width: 0;
    height: 0;
    position: absolute;
    top: 0;
    left: calc(50% - var(--size));
    border: var(--size) solid transparent;
    border-top: var(--size) solid var(--accent-color);
  }

  nav a {
    display: flex;
    height: 100%;
    align-items: center;
    padding: 0 1em;
    color: var(--heading-color);
    font-weight: 700;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    text-decoration: none;
    transition: color 0.2s linear;
  }

  a:hover {
    color: var(--accent-color);
  }
</style>
