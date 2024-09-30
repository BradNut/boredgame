import { Hono } from 'hono'
import type { BlankSchema } from 'hono/types'
import type { HonoTypes } from './hono'

export abstract class Controller {
	protected readonly controller: Hono<HonoTypes, BlankSchema, '/'>
	constructor() {
		this.controller = new Hono()
	}
	abstract routes(): Hono<HonoTypes, BlankSchema, '/'>
}
