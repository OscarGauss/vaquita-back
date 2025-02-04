require('dotenv').config();
import { LogLevel } from '@juki-team/commons';
import { log } from 'helpers';
import { dbClient } from 'services/database';

(async () => {
  await dbClient.connect();
  log(LogLevel.INFO)(`mongo client connected`);
})();
