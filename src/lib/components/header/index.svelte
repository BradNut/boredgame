<script lang="ts">
	import { enhance } from '$app/forms';
	import { LogOut } from 'lucide-svelte';
	import Button from '$components/ui/button/Button.svelte';
	import logo from './bored-game.png';
	import Avatar from '$components/ui/avatar/Avatar.svelte';
	import AvatarFallback from '$components/ui/avatar/AvatarFallback.svelte';
	import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from "$components/ui/sheet";

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
			<Sheet>
				<SheetTrigger>
					<Avatar class="h-16 w-16 bg-neutral-100">
						<AvatarFallback class="text-3xl font-medium text-magnum-700">
							{user?.username.slice(0, 1).toUpperCase() || '?'}
						</AvatarFallback>
					</Avatar>
				</SheetTrigger>
				<SheetContent position="right" size="lg">
					<SheetHeader>
						<SheetTitle>Menu</SheetTitle>
					</SheetHeader>
					<div class="menu">
						<div class="item">
							<SheetClose>
								<Button variant="link" href="/profile">View Profile</Button>
							</SheetClose>
						</div>
						<div class="item">
							<SheetClose>
								<Button variant="link" href="/collection">Your Collection</Button>
							</SheetClose>
						</div>
						<div class="item">
							<SheetClose>
								<Button variant="link" href="/wishlist">Your Wishlist</Button>
							</SheetClose>
						</div>
						<div class="separator" />
						<div class="item">
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
					</div>
					<SheetFooter>
						<SheetClose>
							<Button type="button">Close</Button>
						</SheetClose>
					</SheetFooter>
				</SheetContent>
			</Sheet>
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

	.menu {
		display: grid;
	}

	.item {
		margin-bottom: 0.2rem;
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
