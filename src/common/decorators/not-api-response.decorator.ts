export function ApiResponseSkip() {
    return (
      target: any,
      key?: string | symbol,
      descriptor?: TypedPropertyDescriptor<any>,
    ) => {
      if (descriptor) {
        Reflect.defineMetadata('skip_api_response', true, descriptor.value);
        return descriptor;
      }
      Reflect.defineMetadata('skip_api_response', true, target);
      return target;
    };
  }