declare module '*.vue' {
  import { defineComponent } from 'vue';
  const Component: ReturnType<typeof defineComponent>;
  export default Component;
}

declare module 'ofx-js' {
  export function parse(data: string): Promise<string>;
}
