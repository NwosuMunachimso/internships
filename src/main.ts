import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as winston from 'winston';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
 
//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder() // create options
    .setTitle('Internship Application')
    .setDescription('Application developed as teaching aid')
    .setVersion('v1')
    .build();

  const document = SwaggerModule.createDocument(app, config); // create a document

  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
  logger.info(`App is running on ${await app.getUrl()}`)
}
bootstrap();
