import process from 'node:process';
import * as dotenv from 'dotenv';
import { select } from '@quanxiaoxiao/datav';

dotenv.config();

const initialState = {
  dateTimeCreate: Date.now(),
  server: {
    port: select({ type: 'integer' })(process.env.SERVER_PORT),
  },
  routeMatchList: [],
};

export default initialState;
