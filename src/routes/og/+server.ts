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
		const header = url.searchParams.get('header') ?? undefined;
		const page = url.searchParams.get('page') ?? undefined;
		const content = url.searchParams.get('content') ?? '';
		const result = SocialImageCard.render({
			header,
			page,
			content,
			image: ogImage,
			width,
			height,
			url: new URL(url.origin).href
		});
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
