import serverlessExpress from '@codegenie/serverless-express';
import apiV1GroupRouter from 'app/group/route';
import apiV1Router from 'app/route';
import type { APIGatewayEvent, Context } from 'aws-lambda';
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

app.use('/', apiV1Router);
// @ts-ignore
app.use('/group', setCompany(), apiV1GroupRouter);

app.use(notFoundResponse);

let serverlessExpressInstance: any;

async function asyncTask() {
  try {
    await dbClient.connect();
  } catch (error) {
    log(LogLevel.ERROR)('error', error);
  }
}

async function setup(event: APIGatewayEvent, context: Context) {
  await asyncTask();
  serverlessExpressInstance = serverlessExpress({ app });
  return serverlessExpressInstance(event, context);
}

function handler(event: APIGatewayEvent, context: Context) {
  
  log(LogLevel.INFO)('event', { event });
  
  if (serverlessExpressInstance) {
    return serverlessExpressInstance(event, context);
  }
  
  return setup(event, context);
}

exports.handler = handler;
