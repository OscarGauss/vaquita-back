import * as process from 'process';

export {
  NODE_ENV,
  VERSION,
  PORT,
  AWS_REGION,
  LOG_LEVEL,
  SHARED_TASK_STATUSES_FOLDER,
  JUKI_SECRET_TOKEN,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
} from '@juki-team/base-back';

export const ORIGINS = [
  ...(process.env.ORIGINS || '').split(','),
  /^((https:\/\/vaquita\.fi)|(https:\/\/[a-zA-Z0-9\-_]+\.vaquita\.fi))$/,
];

export const MONGO_DATABASE_URI = process.env.MONGO_DATABASE_URI || '';
export const MONGO_DATABASE_NAME = process.env.MONGO_DATABASE_NAME || '';

export const COMPANY_HOSTS = (process.env.COMPANY_HOSTS || '').split(',,').map(hosts => hosts.split(','));
