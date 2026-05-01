import { Hono } from 'hono'
import helloRoute from './routes/hello.route'

const app = new Hono()

// Routes
app.route('/', helloRoute)

export default app
