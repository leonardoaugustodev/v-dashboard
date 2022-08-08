declare module '*.vue' {
  import { defineComponent } from 'vue';
  const Component: ReturnType<typeof defineComponent>;
  export default Component;
}

declare module 'ofx-js'{
  const parse: ReturnType<any>;
  export default parse;
}