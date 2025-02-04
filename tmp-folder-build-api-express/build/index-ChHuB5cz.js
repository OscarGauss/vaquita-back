'use strict';

var app = require('./app-BT8strgE.js');
require('path');
require('tty');
require('util');
require('fs');
require('net');
require('events');
require('stream');
require('zlib');
require('buffer');
require('string_decoder');
require('querystring');
require('url');
require('http');
require('crypto');
require('os');
require('https');
require('http2');
require('process');
require('timers');
require('dns');
require('fs/promises');
require('tls');
require('child_process');
require('timers/promises');



exports.ENV_ACCOUNT_ID = app.ENV_ACCOUNT_ID;
exports.ENV_CREDENTIAL_SCOPE = app.ENV_CREDENTIAL_SCOPE;
exports.ENV_EXPIRATION = app.ENV_EXPIRATION;
exports.ENV_KEY = app.ENV_KEY;
exports.ENV_SECRET = app.ENV_SECRET;
exports.ENV_SESSION = app.ENV_SESSION;
exports.fromEnv = app.fromEnv;
