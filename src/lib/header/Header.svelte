<script lang="ts">
	// import {
  //   Theme,
  //   RadioButtonGroup,
  //   RadioButton,
  // } from "carbon-components-svelte";
	// import type { CarbonTheme } from "carbon-components-svelte/types/Theme/Theme.svelte";
	import { Switch } from '@rgossiaux/svelte-headlessui';
	import { page } from '$app/stores';
	import logo from './svelte-logo.svg';

	// let theme: CarbonTheme = "white";
	let enabled = false;
</script>

<header>
	<div class="corner">
		<a href="https://kit.svelte.dev">
			<img src={logo} alt="SvelteKit" />
		</a>
	</div>

	<nav>
		<!-- <Theme
		render="toggle"
		toggle={{
			themes: ['white','g100'],
			hideLabel: true,
			size: 'sm'
		}}
		bind:theme
		persist
		persistKey="__carbon-theme"
	/> -->
	<div>
		<Switch
			checked={enabled}
			on:change={(e) => (enabled = e.detail)}
			class={enabled ? "switch switch-enabled" : "switch switch-disabled"}>
			<span class="sr-only">Enable notifications</span>
			<span class="toggle" class:toggle-on={enabled} class:toggle-off={!enabled} />
		</Switch>
	</div>
		<ul>
			<li class:active={$page.url.pathname === '/'}><a sveltekit:prefetch href="/">Home</a></li>
			<li class:active={$page.url.pathname === '/about'}>
				<a sveltekit:prefetch href="/about">About</a>
			</li>
		</ul>
	</nav>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
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
	
	:global(.switch) {
    position: relative;
    display: inline-flex;
    align-items: center;
    border-radius: 1rem;
		border: 0;
    height: 1.25rem;
    width: 2.5rem;
  }

  :global(.switch-enabled) {
    /* Blue */
    background-color: rgb(37 99 235);
  }

  :global(.switch-disabled) {
    /* Gray */
    background-color: rgb(229 231 235);
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .toggle {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    background-color: rgb(255 255 255);
    border-radius: 1rem;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
    transition-property: transform;
  }

  .toggle-on {
    transform: translateX(1.4rem);
  }

  .toggle-off {
    transform: translateX(0.1rem);
  }
</style>
