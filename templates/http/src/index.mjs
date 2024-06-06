import net from 'node:net';
import process from 'node:process';
import handleSocket from '@quanxiaoxiao/httttp';
import {
  generateRouteMatchList,
  createHttpRequestHooks,
} from '@quanxiaoxiao/http-router';
import store from './store/store.mjs';
import routes from './routes/index.mjs';

process.nextTick(() => {
  const { getState, dispatch } = store;
  dispatch('routeMatchList', generateRouteMatchList(routes));
  const httpRequestHooks = createHttpRequestHooks({
    getRouteMatches: () => getState().routeMatchList,
  });

  const server = net.createServer((socket) => handleSocket({
    ...httpRequestHooks,
    socket,
  }));

  const { port } = getState().server;

  server.listen(port, () => {
    console.log(`server listen at \`${port}\``);
  });
});

process.on('uncaughtException', (error) => {
  console.error('boooooooom');
  console.error(error);
  process.exit(1);
});
