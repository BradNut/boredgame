<script lang="ts">
	import { enhance } from '$app/forms';
	import { LogOut } from 'lucide-svelte';
	import Button from '$components/ui/button/Button.svelte';
	 import { createDropdownMenu } from '@melt-ui/svelte'
  const { menu, item, trigger, arrow, separator } = createDropdownMenu();
	// import Profile from '../preferences/profile.svelte';
	import logo from './bored-game.png';
	import Avatar from '$components/ui/avatar/Avatar.svelte';
	import AvatarImage from '$components/ui/avatar/AvatarImage.svelte';
	import AvatarFallback from '$components/ui/avatar/AvatarFallback.svelte';

	export let user: any;
</script>

<header>
	<div class="corner">
		<a href="/" title="Home">
			<img src={logo} alt="Bored Game Home" />
		</a>
	</div>
	<!-- <TextSearch /> -->
	<nav>
		{#if user}
			<a href="/collection" title="Go to your collection" data-sveltekit-preload-data>Collection</a>
			<a href="/wishlist" title="Go to your wishlist" data-sveltekit-preload-data>Wishlist</a>
			<button melt={$trigger}>
				<Avatar class="h-16 w-16 bg-neutral-100">
					<AvatarFallback class="text-3xl font-medium text-magnum-700">
						{user?.username.slice(0, 2).toUpperCase() || '?'}
					</AvatarFallback>
				</Avatar>
			</button>
			<div melt={$menu}>
				<div {...$item} use:item>
					<a href="/profile">Profile</a>
				</div>
				<div class="separator" melt={$separator} />
				<div {...$item} use:item={{
					onSelect: (e) => {
						e.preventDefault();
					}
				}}>
					<form
						use:enhance
						action="/auth/signout"
						method="POST"
					>
						<Button type="submit">
							<LogOut class="mr-2 h-4 w-4"/>
							Sign out
						</Button>
					</form>
				</div>
				<div melt={$arrow} />
			</div>
			<!-- <form
				use:enhance
				action="/auth/signout"
				method="POST"
			>
				<Button type="submit">
					<LogOut class="mr-2 h-4 w-4"/>
					Sign out
				</Button>
			</form> -->
		{/if}
		{#if !user}
			<a href="/auth/signin">
				<span class="flex-auto">Sign In</span></a
			>
			<a href="/auth/signup">
				<span class="flex-auto">Sign Up</span></a
			>
		{/if}
		<!-- <Profile /> -->
	</nav>
</header>

<style lang="postcss">
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--containerPadding);
		font-size: 1.6rem;

		@media (max-width: 1000px) {
			padding-top: 1.25rem;
		}
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
		width: 1.5em;
		height: 1.5em;
		object-fit: contain;
	}

	nav {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		margin: 1rem;
		--background: rgba(255, 255, 255, 0.7);
	}

	nav a {
		/* display: flex; */
		/* height: 100%; */
		/* align-items: center; */
		/* padding: 0 1em; */
		color: var(--heading-color);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		text-decoration: underline;
		color: var(--accent-color);
	}
</style>
