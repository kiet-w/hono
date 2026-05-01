import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.json({ message: 'Hello!' }))

app.post('/echo', async (c) => {
  const body = await c.req.json()
  return c.json(body)
})

export default app
