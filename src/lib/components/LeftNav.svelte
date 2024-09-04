<script lang="ts">
import { page } from '$app/stores'

type Route = {
	href: string
	label: string
}

let { children, routes }: { children: unknown; routes: Route[] } = $props()
</script>

<div class="security-nav">
	<nav>
		<ul>
			{#each routes as { href, label }}
				<li>
					<a href={href} class:active={$page.url.pathname === href}>
						{label}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
	<div class="security-nav-content">
		{@render children()}
	</div>
</div>

<style lang="postcss">
	.security-nav {
		display: flex;

		nav {
			width: 16rem;
			position: sticky;
			top: 0;
			left: 0;
			background-color: #fff;
			padding: 1rem;
			border-right: 1px solid #ddd;
			height: 100vh;

			ul {
				list-style-type: none;
				padding: 0;
				margin: 0;
			}

			li {
				margin-bottom: 0.5rem;
			}

			a {
				text-decoration: none;
				color: #337ab7;
				display: block;
				padding: 0.5rem;
				border-radius: 0.25rem;

				&:hover {
					background-color: #f8f9fa;
				}

				&.active {
					color: #23527c;
					font-weight: bold;
					background-color: #e9ecef;
				}
			}
		}
	}

	.security-nav-content {
		flex: 1;
		padding: 1rem;
	}
</style>