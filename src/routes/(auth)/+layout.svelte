<script lang="ts">
	import { page } from "$app/stores";
	import { Button } from "$lib/components/ui/button";
	import Logo from "$lib/components/logo.svelte";
	import Transition from '$lib/components/transition.svelte';

	let { data, children } = $props();
</script>

<div class="container">
	<a href="/" class="auth-logo">
		<div class="logo-image">
			<Logo />
		</div>
		Bored Game
	</a>
	<div class="auth-buttons">
		{#if $page.url.pathname !== "/login"}
			<Button
				href="/login"
				variant="ghost"
			>
				Login
			</Button>
		{/if}
		{#if $page.url.pathname !== "/sign-up"}
			<Button
				href="/sign-up"
				variant="ghost"
			>
				Sign up
			</Button>
		{/if}
	</div>
	<div class="auth-marketing">
		<div
			class="image"
			style="
				background-image:
					url(https://images.unsplash.com/photo-1588591795084-1770cb3be374?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
		></div>
		<div class="quote-wrapper">
			<blockquote class="quote">
				<p>
					"How many games do I own? What was the last one I played? What haven't I played in a long time? If this sounds like you then Bored Game is your new best friend."
				</p>
				<footer>Bradley</footer>
			</blockquote>
		</div>
	</div>
	<div>
		{@render children()}
	</div>
</div>

<style lang="postcss">
	.container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100%;
		min-height: 100vh;

		@media (width >= 768px) {
			display: grid
		}
		@media (width >= 1024px) {
			padding-left: 0;
			padding-right: 0;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			max-width: none;
		}

		.auth-marketing {
			display: none;
			position: relative;
			padding: 2.5rem;
			flex-direction: column;
			height: 100%;
			color: #ffffff;

			@media (width >= 1024px) {
				display: flex;
			}

			.image {
				position: absolute;
				top: 0;
				right: 0;
				bottom: 0;
				left: 0;
				background-size: cover;
			}

			.quote-wrapper {
				position: relative;
				z-index: 20;
				margin-top: auto;

				.quote {
					margin-top: 0.5rem;

					p {
						font-size: 1.125rem;
						line-height: 1.75rem;
					}
				}

				footer {
					font-size: 0.875rem;
					line-height: 1.25rem;
				}
			}
		}
	}

	:global(.auth-buttons) {
		position: absolute;
		top: 1rem;
		right: 1rem;

		@media (min-width >= 768px) {
			top: 2rem;
			right: 2rem;
		}
	}

	.auth-logo {
		display: flex;
		position: relative;
		z-index: 20;
		gap: 0.5rem;
		align-items: center;
		font-size: 1.125rem;
		line-height: 1.75rem;
		font-weight: 500;
		transition-property: color, background-color, border-color,text-decoration-color, fill, stroke;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 300ms;
		top: 1rem;
		left: 1rem;

		&:hover {
			color: hsl(var(--muted-foreground));
		}

		.logo-image {
			width: 2rem;
			height: 2rem;
		}

		@media (width <= 768px) {
			position: absolute;

		}

		@media (width > 768px) {
			position: absolute;
			--fg: #2c3e50;
		}

		@media (width >= 1024px) {
			color: white;
			--fg: white;
		}
	}
</style>