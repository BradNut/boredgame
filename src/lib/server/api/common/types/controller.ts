import { Hono } from 'hono';
import type { BlankSchema } from 'hono/types';
import type { AppBindings } from './hono';

export abstract class Controller {
	protected readonly controller: Hono<AppBindings, BlankSchema, '/'>;
	constructor() {
		this.controller = new Hono();
	}
	abstract routes(): Hono<AppBindings, BlankSchema, '/'>;
}
