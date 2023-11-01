import { Express, Request, Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import config from 'config';
import { version } from '../../package.json';
import { log } from './logger';

//configs
const PORT = config.get<string>('port');

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PUBLIC REST API Docs',
      version,
      description:
        'The Public APIs project is designed to provide a collection of free and accessible APIs that can be integrated into various frontend applications. The project aims to facilitate learning and experimentation with frontend development by offering a diverse range of publicly available APIs.',
      contact: {
        name: 'Sameer Ruddin Shaik',
        email: 'sameerruddinshaik@gmail.com',
      },
      servers: [`http://localhost:${PORT}/api/v1`],
    },
  },
  apis: ['./src/routes.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export function swaggerDocs(app: Express, port: string) {
  // Swagger page
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in JSON format
  app.get('/docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  log.info(`Docs available at http://localhost:${port}/docs`);
}


