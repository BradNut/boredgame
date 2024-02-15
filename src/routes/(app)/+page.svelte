<script lang="ts">
	import Logo from "$components/logo.svelte";
</script>

<div class="container">
	<div class="logo">
		<Logo />
	</div>
	<h1>Welcome to Bored Game</h1>
	<h2>Keep track of your board games!</h2>
	<p>The ones you own, the ones you want, and whether you play them enough.</p>
	<p>Get started by joinging the <a href="/waitlist">waitlist</a> or <a href="/login">signing in</a>.</p>
</div>

<style lang="postcss">
	.container {
		max-width: 900px;
		display: grid;
		gap: 0.25rem;
	}

	.logo {
		width: 4rem;
		height: 4rem;
	}
</style>
