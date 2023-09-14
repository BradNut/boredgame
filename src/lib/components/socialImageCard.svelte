<script lang="ts">
	export let title: string;
	export let image: string;
	export let description: string;
</script>

<div class="social-card">
	<div class="social-card-header">
			<div class="social-card-title">
				<div class="social-card-image">
					<img src={image || '/images/bored-game.png'} alt="Bored Game" />
				</div>
				<p>{title}</p>
			</div>
	</div>
	<div class="social-card-content">
		<p>{description}</p>
	</div>
</div>

<style>
	@font-face {
		font-family: 'Noto Sans';
		src: url('/src/lib/NotoSans-Regular.ttf');
	}

	.social-card {
		display: flex;
		flex-direction: column;
		border-radius: 0.5rem;
		border-width: 1px;
		box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
		width: 350px;
	}

	.social-card-header {
		display: flex;
		padding: 1.5rem;
		margin-top: 0.375rem;
		flex-direction: column;
	}

	.social-card-title {
		display: flex;
		gap: 0.25rem;
		place-items: center;
		font-size: 1.125rem;
		line-height: 1.75rem;
		font-weight: 600;
		letter-spacing: -0.025em;
		line-height: 1;
	}

	.social-card-image {
		display: flex;
		width: 2rem;
		height: 2rem;
	}

	.social-card-content {
		display: flex;
		padding: 1.5rem;
		padding-top: 0;
	}
</style>