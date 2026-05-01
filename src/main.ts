import { Hono } from 'hono';
import { registerRoutes } from './utils/router';
import { UserController } from './controllers/user.controller';

const app = new Hono();

registerRoutes(app, [UserController]);

export default app;
