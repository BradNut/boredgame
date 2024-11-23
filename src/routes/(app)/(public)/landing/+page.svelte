<script lang="ts">
	const { data } = $props();
</script>

<div class="container">
	<h1>Welcome to Bored Game!</h1>
	<h2>Track the board games you own, the ones you want, and whether you play them enough.</h2>
	<p>
		Get started by joining the <a href="/waitlist">wait list</a> or <a href="/login">log in</a> if you already have an account.
	</p>
</div>

<style lang="postcss">
	a {
		text-decoration: underline;
	}

	.container {
		display: grid;
		place-content: center;
		max-width: 900px;
		gap: 0.25rem;
		margin-left: auto;
		margin-right: auto;
	}
</style>
