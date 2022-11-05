import { mediaQueryStore } from 'svelte-media-query-store';

export const xs = mediaQueryStore('(min-width: 480px');

export const sm = mediaQueryStore('(min-width: 640px');

export const md = mediaQueryStore('(min-width: 768px)');

export const lg = mediaQueryStore('(min-width: 1024px)');

export const xl = mediaQueryStore('(min-width: 1280px)');

export const xxl = mediaQueryStore('(min-width: 1536px)');
