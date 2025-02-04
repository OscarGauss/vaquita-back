'use strict';

require('os');
require('path');
var app = require('./app-BT8strgE.js');
require('crypto');
require('fs');
var parseKnownFiles = require('./parseKnownFiles-CWjUpGzO.js');
var require$$1 = require('child_process');
var require$$0 = require('util');
require('tty');
require('net');
require('events');
require('stream');
require('zlib');
require('buffer');
require('string_decoder');
require('querystring');
require('url');
require('http');
require('https');
require('http2');
require('process');
require('timers');
require('dns');
require('fs/promises');
require('tls');
require('timers/promises');

const getValidatedProcessCredentials = (profileName, data, profiles) => {
    if (data.Version !== 1) {
        throw Error(`Profile ${profileName} credential_process did not return Version 1.`);
    }
    if (data.AccessKeyId === undefined || data.SecretAccessKey === undefined) {
        throw Error(`Profile ${profileName} credential_process returned invalid credentials.`);
    }
    if (data.Expiration) {
        const currentTime = new Date();
        const expireTime = new Date(data.Expiration);
        if (expireTime < currentTime) {
            throw Error(`Profile ${profileName} credential_process returned expired credentials.`);
        }
    }
    let accountId = data.AccountId;
    if (!accountId && profiles?.[profileName]?.aws_account_id) {
        accountId = profiles[profileName].aws_account_id;
    }
    const credentials = {
        accessKeyId: data.AccessKeyId,
        secretAccessKey: data.SecretAccessKey,
        ...(data.SessionToken && { sessionToken: data.SessionToken }),
        ...(data.Expiration && { expiration: new Date(data.Expiration) }),
        ...(data.CredentialScope && { credentialScope: data.CredentialScope }),
        ...(accountId && { accountId }),
    };
    app.setCredentialFeature(credentials, "CREDENTIALS_PROCESS", "w");
    return credentials;
};

const resolveProcessCredentials = async (profileName, profiles, logger) => {
    const profile = profiles[profileName];
    if (profiles[profileName]) {
        const credentialProcess = profile["credential_process"];
        if (credentialProcess !== undefined) {
            const execPromise = require$$0.promisify(require$$1.exec);
            try {
                const { stdout } = await execPromise(credentialProcess);
                let data;
                try {
                    data = JSON.parse(stdout.trim());
                }
                catch {
                    throw Error(`Profile ${profileName} credential_process returned invalid JSON.`);
                }
                return getValidatedProcessCredentials(profileName, data, profiles);
            }
            catch (error) {
                throw new app.CredentialsProviderError(error.message, { logger });
            }
        }
        else {
            throw new app.CredentialsProviderError(`Profile ${profileName} did not contain credential_process.`, { logger });
        }
    }
    else {
        throw new app.CredentialsProviderError(`Profile ${profileName} could not be found in shared credentials file.`, {
            logger,
        });
    }
};

const fromProcess = (init = {}) => async () => {
    init.logger?.debug("@aws-sdk/credential-provider-process - fromProcess");
    const profiles = await parseKnownFiles.parseKnownFiles(init);
    return resolveProcessCredentials(app.getProfileName(init), profiles, init.logger);
};

exports.fromProcess = fromProcess;
