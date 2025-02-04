require('dotenv').config();
import { log } from '@juki-team/base-back';
import { LogLevel } from '@juki-team/commons';
import { dbClient } from 'services/database';

(async () => {
  await dbClient.connect();
  log(LogLevel.INFO)(`mongo client connected`);
})();
