import serverlessExpress from '@codegenie/serverless-express';
import { loggerAllRequestHandler, loggerRequestTimeHandler, responsesMiddleware } from '@juki-team/base-back';
import apiV1GroupRouter from 'app/group/route';
import apiV1Router from 'app/route';
import type { APIGatewayEvent, Context } from 'aws-lambda';
import bodyParser from 'body-parser';
import { NODE_ENV, ORIGINS, VERSION } from 'config/settings';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { log, shouldDisplayLog } from 'helpers';
import { errorLoggerHandler, errorResponderHandler, failSafeHandler, notFoundResponse, setCompany } from 'middlewares';
import { dbClient } from 'services';
import { LogLevel } from 'types';

log(LogLevel.INFO)('starting initial express set up', { NODE_ENV, VERSION, ORIGINS });
const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
if (shouldDisplayLog(LogLevel.DEBUG)) {
  app.use(loggerAllRequestHandler);
} else if (shouldDisplayLog(LogLevel.INFO)) {
  app.use(loggerRequestTimeHandler);
}

app.use(responsesMiddleware);
app.use(cors({ origin: ORIGINS, credentials: true }));
app.use(cookieParser());
log(LogLevel.INFO)('completed express set up');
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
