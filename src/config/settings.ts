import * as process from 'process';

export {
  NODE_ENV,
  VERSION,
  ORIGINS,
  PORT,
  AWS_REGION,
  LOG_LEVEL,
  SHARED_TASK_STATUSES_FOLDER,
  JUKI_SECRET_TOKEN,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
} from '@juki-team/base-back';

export const MONGO_DATABASE_URI = process.env.MONGO_DATABASE_URI || '';
export const MONGO_DATABASE_NAME = process.env.MONGO_DATABASE_NAME || '';
