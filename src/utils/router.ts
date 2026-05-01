import { Hono } from 'hono';

export function registerRoutes(app: Hono, controllers: any[]) {
  for (const ControllerClass of controllers) {
    const instance = new ControllerClass();
    const basePath = instance._basePath || '';
    const routes = instance._routes || [];

    for (const route of routes) {
      const path = (basePath + route.path).replace(/\/+/g, '/');
      const method = route.method.toLowerCase() as 'get' | 'post';
      
      app[method](path, instance[route.handlerName].bind(instance));
    }
  }
}
