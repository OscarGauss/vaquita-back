require('dotenv').config();
import { LogLevel } from '@juki-team/commons';
import { dbClient } from 'services/database';
import { log } from 'services/log';

(async () => {
  await dbClient.connect();
  log(LogLevel.INFO)(`mongo client connected`);
})();
