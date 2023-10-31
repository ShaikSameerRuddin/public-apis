//external
import express from 'express';
import 'dotenv/config';
import config from 'config';
import bodyParser from 'body-parser';
import rateLimiter from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';

//internal
import { connectDB } from './db/connect';
import { log } from './utils/logger';
import { loggerMiddleware } from './middleware/logger.middleware';
import { routes } from './routes';

//configs
const PORT = config.get<string>('port');
const DB_URL = config.get<string>('dbUrl');

//app
const app = express();

// Define CORS options
const corsOptions = {
  origin: ['http://localhost:4000'], // Set the allowed origin
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Use the cors middleware with the specified options
app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  }),
);
app.use(helmet());
app.use(cors(corsOptions));

app.use(mongoSanitize());

//middlewares
routes(app, express);
app.use(loggerMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//server start
const startServer = async (): Promise<void> => {
  try {
    if (!DB_URL) {
      throw new Error('MONGO_URI not found in environment variables');
    }
    await connectDB(DB_URL);
    log.info(`Connected to MongoDB`);
    app.listen(PORT, () => {
      log.info(`Server is listening on port ${PORT}...`);
    });
  } catch (error) {
    log.error(error);
  }
};

startServer();
