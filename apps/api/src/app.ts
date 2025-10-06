import { Hono } from 'hono'
import { createDb } from '@feedback-thing/db'

export const app = new Hono()
export type App = typeof app
export const db = createDb()
