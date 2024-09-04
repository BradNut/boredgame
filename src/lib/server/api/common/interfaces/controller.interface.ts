import { Hono } from 'hono'
import type { BlankSchema } from 'hono/types'
import type { HonoTypes } from '../../types'

export interface Controller {
	controller: Hono<HonoTypes, BlankSchema, '/'>
	routes(): any
}
