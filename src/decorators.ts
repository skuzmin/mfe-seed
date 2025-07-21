const observedAttributes: Array<string> = [];
const watchers = new Map<string, string>();

export function Component(constructor: Function): void {
  Object.defineProperty(constructor, 'observedAttributes', {
    get() {
      return observedAttributes;
    },
    configurable: true,
  });

  constructor.prototype.attributeChangedCallback = function (
    name: string,
    oldVal: string,
    newVal: string,
  ) {
    this[name] = newVal;
    const method = watchers.get(name);
    if (method && typeof this[method] === 'function') {
      this[method](oldVal, newVal);
    }
  };
}

export function Attribute(): PropertyDecorator {
  return function (_: unknown, propertyKey: string | symbol) {
    if (
      typeof propertyKey === 'string' &&
      !observedAttributes.includes(propertyKey)
    ) {
      observedAttributes.push(propertyKey);
    }
  };
}

export function Watch(attr: string): MethodDecorator {
  return function (_: unknown, propertyKey: string | symbol) {
    if (typeof propertyKey === 'string') {
      watchers.set(attr, propertyKey);
    }
  };
}
