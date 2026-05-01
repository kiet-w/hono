export function Controller(basePath: string) {
  return function (target: any) {
    target.prototype._basePath = basePath;
  };
}

export function Get(path: string) {
  return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
    if (!target._routes) target._routes = [];
    target._routes.push({ method: 'GET', path: path, handlerName: methodName });
  };
}

export function Post(path: string) {
  return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
    if (!target._routes) target._routes = [];
    target._routes.push({ method: 'POST', path: path, handlerName: methodName });
  };
}
