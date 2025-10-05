import { Hono } from 'hono'
import { createDb } from '@feedback-thing/db'

export const app = new Hono()
export const db = createDb()
