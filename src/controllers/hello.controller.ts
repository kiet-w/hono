import { Context } from 'hono'

export const getHello = (c: Context) => c.json({ message: 'Hello!' })

export const postEcho = async (c: Context) => c.json(await c.req.json())
