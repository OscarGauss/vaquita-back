// lambda.js
import apiV1GroupRouter from 'app/group/route';
import apiV1Router from 'app/route';
import type { APIGatewayEvent, Context } from 'aws-lambda';
import awsServerlessExpress from 'aws-serverless-express';
import bodyParser from 'body-parser';
import express from 'express';
import { initialSetupApp, log } from 'helpers';
import { errorLoggerHandler, errorResponderHandler, failSafeHandler, notFoundResponse, setCompany } from 'middlewares';
import { dbClient } from 'services';
import { LogLevel } from 'types';

const app = initialSetupApp();
log(LogLevel.INFO)('starting finish express set up');
app.use(errorLoggerHandler);
app.use(errorResponderHandler);
app.use(failSafeHandler);
log(LogLevel.INFO)('completed finish express set up');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(errorLoggerHandler);
app.use(errorResponderHandler);
app.use(failSafeHandler);

app.use('/v2/vaquita', apiV1Router);
// @ts-ignore
app.use('/v2/vaquita/group', setCompany(), apiV1GroupRouter);

app.use(notFoundResponse);

export const handler = async (event: APIGatewayEvent, context: Context) => {
  log(LogLevel.INFO)('event', { event });
  
  try {
    await dbClient.connect();
    
  } catch (error) {
    log(LogLevel.ERROR)('error', error);
  }
  
  const server = awsServerlessExpress.createServer(app);
  return awsServerlessExpress.proxy(server, event, context);
};
