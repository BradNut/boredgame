<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Logo from '$components/logo.svelte';
	import * as Avatar from '$components/ui/avatar';
	import * as DropdownMenu from '$components/ui/dropdown-menu';
	import { ListChecks, ListTodo, LogOut, Settings } from 'lucide-svelte';

	let { user = null } = $props();

	let avatar: string = $derived(user?.username?.slice(0, 1).toUpperCase() || ':)');
</script>

<header>
	<div class="corner">
		<a href="/" title="Home">
			<div class="logo-image">
				<Logo />
			</div>
			<span class="logo-text">Bored Game</span>
		</a>
	</div>
	<nav>
		{#if user}
			{@render userDropdown()}
		{:else}
			<a href="/login"> <span class="flex-auto">Login</span></a>
			<a href="/signup"> <span class="flex-auto">Sign Up</span></a>
		{/if}
	</nav>
</header>

{#snippet userDropdown()}
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
				<DropdownMenu.Label>Account</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<a href="/settings">
					<DropdownMenu.Item>
						<Settings class="mr-2 h-4 w-4" />
						<span>Settings</span>
					</DropdownMenu.Item>
				</a>
				<a href="/collections">
					<DropdownMenu.Item>
						<ListChecks class="mr-2 h-4 w-4" />
						<span>Collections</span>
					</DropdownMenu.Item>
				</a>
				<a href="/wishlists">
					<DropdownMenu.Item>
						<ListTodo class="mr-2 h-4 w-4" />
						<span>Wishlists</span>
					</DropdownMenu.Item>
				</a>
				<DropdownMenu.Item>
					<form action="/logout" method="POST">
						<button type="submit">
							<div class="flex items-center gap-1">
								<LogOut class="mr-2 h-4 w-4" />
								<span>Sign out</span>
							</div>
						</button>
					</form>
				</DropdownMenu.Item>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/snippet}

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
		margin-left: 1rem;
	}

	.corner a {
		display: flex;
		place-items: center;
		gap: 0.5rem;
		width: 100%;
		height: 100%;
		font-size: 1.125rem;
		line-height: 1.75rem;
		font-weight: 500;
	}

	.logo-image {
		width: 2rem;
		height: 2rem;

		@media (width < 640px) {
			width: 3rem;
			height: 3rem;
		}
	}

	.logo-text {
		@media (width < 640px) {
			display: none;
		}
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
