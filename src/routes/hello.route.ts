import { Hono } from 'hono'
import { getHello, postEcho } from '../controllers/hello.controller'

const helloRoute = new Hono()

helloRoute.get('/', getHello)
helloRoute.post('/echo', postEcho)

export default helloRoute
