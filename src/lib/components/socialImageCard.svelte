<script lang="ts">
	export let header: string;
	export let page: string;
	export let image: string;
	export let content: string;
	export let width = 1200;
	export let height = 630;
	export let url: string;
</script>

<div class="social-card" style={`width: ${width}px; height: ${height}px;`}>
	<div class="social-card-header">
			<div class="social-card-title">
				<div class="social-card-image">
					<img src={image || '/images/bored-game.png'} alt="Bored Game" />
				</div>
				<h1>{header}</h1>
			</div>
	</div>
	<div class="social-card-content">
		<h2 class="page">{page}</h2>
		<p class="content">{content}</p>
	</div>
	<div class="social-card-footer">
		<footer>
			<p>Bored Game &copy; {new Date().getFullYear()} | Built by Bradley Shellnut | {url || 'https://boredgame.vercel.app'}</p>
		</footer>
	</div>
</div>

<style>
	@font-face {
		font-family: 'Fira Sans';
		src: url('/src/lib/FiraSans-Bold.ttf');
	}

	.social-card {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		background-color: #DFDBE5;
		background-image: url("data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm33.414-6l5.95-5.95L45.95.636 40 6.586 34.05.636 32.636 2.05 38.586 8l-5.95 5.95 1.414 1.414L40 9.414l5.95 5.95 1.414-1.414L41.414 8zM40 48c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zM9.414 40l5.95-5.95-1.414-1.414L8 38.586l-5.95-5.95L.636 34.05 6.586 40l-5.95 5.95 1.414 1.414L8 41.414l5.95 5.95 1.414-1.414L9.414 40z' fill='%239C92AC' fill-opacity='0.17' fill-rule='evenodd'/%3E%3C/svg%3E");
	}

	.social-card-header {
		display: flex;
		padding: 1.5rem;
		margin-top: 0.375rem;
		flex-direction: column;
	}

	.social-card-title {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 1.875rem; /* 30px */
		line-height: 2.25rem; /* 36px */
		font-weight: 700;
		letter-spacing: -0.025em;
	}

	.social-card-image {
		display: flex;
		width: 4rem;
		height: 4rem;
	}

	.social-card-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
		padding: 1.5rem;
		padding-top: 0;
	}

	.page {
		font-size: 3.75rem; /* 60px */
		line-height: 1;
		font-weight: 700;
		text-transform: uppercase;
	}

	.content {
		font-size: 1.25rem; /* 20px */
		line-height: 1.75rem; /* 28px */
	}

	.social-card-footer {
		display: flex;
		padding: 1.5rem;
		padding-top: 0;
		align-items: center;
		font-size: 1.25rem;
		line-height: 1.75rem;
		font-weight: 700;
	}
</style>