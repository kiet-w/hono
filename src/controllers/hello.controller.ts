import { Context } from 'hono'

export const getHello = (c: Context) => {
  return c.json({ message: 'Hello!' })
}

export const postEcho = async (c: Context) => {
  const body = await c.req.json()
  return c.json(body)
}
