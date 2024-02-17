<script lang="ts">
	import Logo from "$components/logo.svelte";
</script>

<div class="container">
	<div class="site-logo">
		<div class="logo">
			<Logo />
		</div>
		Bored Game
	</div>
	<h1>Welcome to Bored Game!</h1>
	<h2>Track the board games you own, the ones you want, and whether you play them enough.</h2>
	<p>Get started by joining the <a href="/waitlist">wait list</a> or <a href="/login">log in</a> if you already have an account.</p>
</div>

<style lang="postcss">
	a {
		text-decoration: underline;
	}

	.site-logo {
		display: flex;
		place-items: center;
	}

	.container {
		display: grid;
		place-content: center;
		max-width: 900px;
		gap: 0.25rem;
	}

	.logo {
		display: flex;
		align-items: center;
		width: 4rem;
		height: 4rem;
	}
</style>
