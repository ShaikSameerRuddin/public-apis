import pino from 'pino';
import dayjs from 'dayjs';
import { createWriteStream } from 'fs';
import pinoPretty from 'pino-pretty';


export const log = pino({
  base: {
    pid: false,
  },
  timestamp: () => `,"timestamp":"${dayjs().format('YYYY-MM-DD HH:mm:ss')}"`,
}, pinoPretty());


