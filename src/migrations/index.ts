require('dotenv').config();
import { logMessage } from '@juki-team/base-back';
import { LogLevel } from '@juki-team/commons';
import { dbClient } from 'services/database';

(async () => {
  await dbClient.connect();
  logMessage(LogLevel.INFO)(`mongo client connected`);
})();
