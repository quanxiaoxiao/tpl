import createStore from '@quanxiaoxiao/store';
import initialState from './initialState.mjs';

const store = createStore({
  initialState,
  schemas: {
    'server.port': {
      type: 'integer',
      maximum: 65535,
      minimum: 1,
    },
  },
});

export default store;
