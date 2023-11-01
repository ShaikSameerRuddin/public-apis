import { Request, Response, NextFunction } from 'express';
import { createWriteStream } from 'fs';
import dayjs from 'dayjs';

// Create a write stream for logs
const stream = createWriteStream('app.log', { flags: 'a' });

// Logger middleware
export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');
  const log = `${timestamp} - ${req.method} ${req.url} - ${req.ip}`;
 

   stream.write(log + '\n', (error) => {
    if (error) {
      console.error('Error writing to log file:', error);
    }
  });

  next();
  
};
