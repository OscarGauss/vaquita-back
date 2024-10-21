require('dotenv').config();
import { LogLevel } from '@juki-team/commons';
import { logMessage } from 'helpers';
import { dbClient } from 'services/database';

(async () => {
  await dbClient.connect();
  logMessage(LogLevel.INFO)(`mongo client connected`);
})();
