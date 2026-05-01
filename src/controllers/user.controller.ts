import { Hono } from 'hono';
import { Controller, Get, Post } from '../utils/decorators';

@Controller('/users')
export class UserController {
  @Get('/')
  getAll(c: any) {
    return c.json(['Alice', 'Bob', 'Charlie']);
  }

  @Get('/:id')
  getOne(c: any) {
    return c.json({ id: c.req.param('id'), name: 'Alice' });
  }

  @Post('/')
  async create(c: any) {
    const body = await c.req.json();
    return c.json({ message: 'User created!', data: body }, 201);
  }
}
