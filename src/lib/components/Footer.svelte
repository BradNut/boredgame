<script>
	import { PUBLIC_SITE_URL } from '$env/static/public';
</script>

<footer>
	<p>Bored Game &copy; {new Date().getFullYear()}</p>
	<p>Built by <a target="__blank" href="https://bradleyshellnut.com">Bradley Shellnut</a>
	</p>
	<p>{PUBLIC_SITE_URL}</p>
</footer>

<style lang="postcss">
	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 0.25rem;
	}

	footer a {
		font-weight: bold;
	}

	@media (width < 640px) {
		footer {
			padding: 40px 0;
		}
	}
</style>