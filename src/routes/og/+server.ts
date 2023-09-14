import type { RequestHandler } from '@sveltejs/kit';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { html as toReactNode } from 'satori-html';
import NotoSans from '$lib/fonts/NotoSans-Regular.ttf';
import SocialImageCard from '$components/socialImageCard.svelte';

const height = 630;
const width = 1200;

export const GET: RequestHandler = async ({ url }) => {
	try {
		const ogImage = `${new URL(url.origin).href}images/bored-game.png`;
		const title = url.searchParams.get('title') ?? undefined;
		const description = url.searchParams.get('description') ?? '';
		const result = SocialImageCard.render({ title, image: ogImage, description });
		console.log('result', result);
		const element = toReactNode(`${result.html}<style>${result.css.code}</style>`);
		const svg = await satori(element, {
			fonts: [
				{
					name: 'Noto Sans',
					data: Buffer.from(NotoSans),
					style: 'normal'
				}
			],
			height,
			width
		});

		const resvg = new Resvg(svg, {
			fitTo: {
				mode: 'width',
				value: width
			}
		});

		const image = resvg.render();

		return new Response(image.asPng(), {
			headers: {
				'content-type': 'image/png'
			}
		});
	} catch (e) {
		console.error(e);
	}
};
