<script lang="ts">
	import { page } from "$app/stores";
	import { Button } from "$lib/components/ui/button";
	import Logo from "$lib/components/logo.svelte";
	import Transition from '$lib/components/transition.svelte';

	export let data;
</script>

<div class="container">
	<a href="/" class="auth-logo">
		<div class="logo-image">
			<Logo />
		</div>
		Bored Game
	</a>
	<Button
		href={$page.url.pathname === "/sign-up" ? "/login" : "/sign-up"}
		variant="ghost"
		class="auth-button"
	>
		{#if $page.url.pathname === "/sign-up"}
			Login
		{:else}
			Sign up
		{/if}
	</Button>
	<div class="auth-marketing">
		<div
			class="image"
			style="
				background-image:
					url(https://images.unsplash.com/photo-1588591795084-1770cb3be374?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
		/>
		<div class="quote-wrapper">
			<blockquote class="quote">
				<p>
					"How many games do I own? What was the last one I played? What haven't I played in a long time? If this sounds like you then Bored Game is your new best friend."
				</p>
				<footer>Bradley</footer>
			</blockquote>
		</div>
	</div>
	<div class="auth-form">
		<Transition url={data.url} transition={{ type: 'page' }}>
			<slot />
		</Transition>
	</div>
</div>

<style lang="postcss">
	.container {
		/* display: none;
		position: relative; */
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100%;
		min-height: 100vh;

		@media (min-width: 768px) {
			display: grid
		}
		@media (min-width: 1024px) {
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

			@media (min-width: 1024px) {
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

		.auth-form {
			@media (min-width: 1024px) {
				padding: 2rem;
			}
		}
	}

	:global(.auth-button) {
		position: absolute;
		top: 1rem;
		right: 1rem;

		@media (min-width: 768px) {
			top: 2rem;
			right: 2rem;
		}
	}

	:global(.auth-logo) {
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

		&:hover {
			color: hsl(var(--muted-foreground));
		}

		.logo-image {
			width: 2rem;
			height: 2rem;
		}

		@media (max-width: 768px) {
			position: absolute;
			top: 1rem;
			left: 1rem;
		}

		@media (min-width: 768px) {
			position: absolute;
			top: 2rem;
			left: 2rem;
		}

		@media (min-width: 1024px) {
			color: white;
		}
	}
</style>