<script lang="ts">
	import { enhance } from '$app/forms';
	import { ListChecks, ListTodo, LogOut, User } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import * as Avatar from "$lib/components/ui/avatar";
	import Logo from '$components/logo.svelte';

	export let user: any;

	let avatar = user?.username.slice(0, 1).toUpperCase() || '?';
</script>

<header>
	<div class="corner">
		<a href="/" title="Home">
			<Logo />
		</a>
	</div>
	<!-- <TextSearch /> -->
	<nav>
		{#if user}
			<a href="/collection" title="Go to your collection" data-sveltekit-preload-data>Collection</a>
			<a href="/wishlist" title="Go to your wishlist" data-sveltekit-preload-data>Wishlist</a>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<Avatar.Root asChild>
						<Avatar.Fallback class="text-3xl font-medium text-magnum-700 h-16 w-16 bg-neutral-100">
							{avatar}
						</Avatar.Fallback>
					</Avatar.Root>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Group>
						<DropdownMenu.Label>My Account</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.Item>
							<User class="mr-2 h-4 w-4" />
							<Button variant="link" class="text-secondary-foreground" href="/profile">Profile</Button>
							<DropdownMenu.Shortcut>⇧⌘P</DropdownMenu.Shortcut>
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							<ListChecks class="mr-2 h-4 w-4" />
							<Button variant="link" class="text-secondary-foreground" href="/collection">Collection</Button>
							<DropdownMenu.Shortcut>⇧⌘C</DropdownMenu.Shortcut>
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							<ListTodo class="mr-2 h-4 w-4" />
							<Button variant="link" class="text-secondary-foreground" href="/wishlist">Wishlist</Button>
							<DropdownMenu.Shortcut>⇧⌘W</DropdownMenu.Shortcut>
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							<form
								use:enhance
								action="/logout"
								method="POST"
							>
								<Button type="submit">
									<LogOut class="mr-2 h-4 w-4"/>
									Sign out
								</Button>
							</form>
							<DropdownMenu.Shortcut>⇧⌘Q</DropdownMenu.Shortcut>
						</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		{/if}
		{#if !user}
			<a href="/login">
				<span class="flex-auto">Login</span></a
			>
			<a href="/sign-up">
				<span class="flex-auto">Sign Up</span></a
			>
		{/if}
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

	.menu {
		display: grid;
	}

	.corner {
		width: 3em;
		height: 3em;
		margin-left: 1rem;
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

	/* .menu {
    @apply z-10 flex max-h-[300px] min-w-[220px] flex-col shadow-lg;
    @apply rounded-md bg-slate-300 p-1 shadow-neutral-900/30 lg:max-h-none;
    @apply ring-0 !important;
  } */
	/*
  .subMenu {
    @apply min-w-[220px] shadow-md shadow-neutral-900/30;
  }*/
  /* .item {
    @apply relative h-6 select-none rounded-sm pl-6 pr-1;
    @apply z-20 text-slate-700 outline-none;
    @apply data-[highlighted]:bg-slate-200 data-[highlighted]:text-slate-700;
    @apply data-[disabled]:text-neutral-300;
    @apply flex items-center leading-none;
    @apply ring-0 !important;
  } */
	/*
  .trigger {
    @apply inline-flex h-9 w-9 items-center justify-center rounded-full bg-white;
    @apply text-magnum-700 transition-colors hover:bg-white/90;
    @apply data-[highlighted]:ring-magnum-400 data-[highlighted]:ring-offset-2 !important;
    @apply p-0 text-sm font-medium focus:ring data-[highlighted]:outline-none;
  }
  .check {
    @apply absolute left-2 top-1/2 text-magnum-500;
    translate: 0 calc(-50% + 1px);
  }

  .dot {
    @apply h-[4.75px] w-[4.75px] rounded-full bg-magnum-700;
  } */

  .separator {
    @apply m-[5px] h-[1px] bg-black;
  }

  /* .rightSlot {
    @apply ml-auto pl-5;
  }

  .icon {
    @apply h-[13px] w-[13px];
  }
  .check {
    @apply absolute left-0 inline-flex w-6 items-center justify-center;
  }
  .text {
    @apply pl-6 text-xs leading-6 text-neutral-600;
  } */
</style>
