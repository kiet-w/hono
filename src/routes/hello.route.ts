import { Hono } from 'hono'
import { getHello, postEcho } from '../controllers/hello.controller'

const router = new Hono()

router.get('/', getHello)
router.post('/echo', postEcho)

export default router
