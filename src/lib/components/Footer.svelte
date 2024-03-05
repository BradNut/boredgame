<script>
	import { PUBLIC_SITE_URL } from "$env/static/public";
</script>

<footer>
	<p>Bored Game &copy; {new Date().getFullYear()} | Built by <a target="__blank" href="https://bradleyshellnut.com">Bradley Shellnut</a> | {PUBLIC_SITE_URL}</p>
</footer>

<style lang="postcss">
  footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 40px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 40px 0;
		}
	}
</style>