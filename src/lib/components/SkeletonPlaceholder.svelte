<!-- Taken from carbon design system svelte -->
<!-- https://github.com/carbon-design-system/carbon-components-svelte/blob/master/src/SkeletonPlaceholder/SkeletonPlaceholder.svelte -->
<script lang="ts">
export let style: string
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div
	{style}
	class:bx--skeleton__placeholder={true}
	{...$$restProps}
	on:click
	on:mouseover
	on:mouseenter
	on:mouseleave
/>

<style lang="postcss">
	@keyframes skeleton {
		0% {
			opacity: 0.3;
			-webkit-transform: scaleX(0);
			transform: scaleX(0);
			-webkit-transform-origin: left;
			transform-origin: left;
		}
		20% {
			opacity: 1;
			-webkit-transform: scaleX(1);
			transform: scaleX(1);
			-webkit-transform-origin: left;
			transform-origin: left;
		}
		28% {
			-webkit-transform: scaleX(1);
			transform: scaleX(1);
			-webkit-transform-origin: right;
			transform-origin: right;
		}
		51% {
			-webkit-transform: scaleX(0);
			transform: scaleX(0);
			-webkit-transform-origin: right;
			transform-origin: right;
		}
		58% {
			-webkit-transform: scaleX(0);
			transform: scaleX(0);
			-webkit-transform-origin: right;
			transform-origin: right;
		}
		82% {
			-webkit-transform: scaleX(1);
			transform: scaleX(1);
			-webkit-transform-origin: right;
			transform-origin: right;
		}
		83% {
			-webkit-transform: scaleX(1);
			transform: scaleX(1);
			-webkit-transform-origin: left;
			transform-origin: left;
		}
		96% {
			-webkit-transform: scaleX(0);
			transform: scaleX(0);
			-webkit-transform-origin: left;
			transform-origin: left;
		}
		100% {
			opacity: 0.3;
			-webkit-transform: scaleX(0);
			transform: scaleX(0);
			-webkit-transform-origin: left;
			transform-origin: left;
		}
	}

	.bx--skeleton__placeholder {
		--cds-skeleton-01: #474747;
		border-radius: var(--borderRadius);
		position: relative;
		padding: 0;
		border: none;
		background: var(--cds-skeleton-01, #e5e5e5);
		box-shadow: none;
		pointer-events: none;
		width: 6.25rem;
		height: 6.25rem;
	}

	.bx--skeleton__placeholder:hover,
	.bx--skeleton__placeholder:focus,
	.bx--skeleton__placeholder:active {
		border: none;
		cursor: default;
		outline: none;
	}

	.bx--skeleton__placeholder::before {
		--cds-skeleton-02: #525252;
		border-radius: var(--borderRadius);
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		-webkit-animation: 3000ms ease-in-out skeleton infinite;
		animation: 3000ms ease-in-out skeleton infinite;
		background: var(--cds-skeleton-02, #c6c6c6);
		content: '';
		will-change: transform-origin, transform, opacity;
	}

	@media (prefers-reduced-motion: reduce) {
		.bx--skeleton__placeholder::before {
			-webkit-animation: none;
			animation: none;
		}
	}
</style>
