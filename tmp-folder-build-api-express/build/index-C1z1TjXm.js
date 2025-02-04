'use strict';

var app = require('./app-BT8strgE.js');
var fs = require('fs');
require('path');
require('tty');
require('util');
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

const fromWebToken = (init) => async () => {
    init.logger?.debug("@aws-sdk/credential-provider-web-identity - fromWebToken");
    const { roleArn, roleSessionName, webIdentityToken, providerId, policyArns, policy, durationSeconds } = init;
    let { roleAssumerWithWebIdentity } = init;
    if (!roleAssumerWithWebIdentity) {
        const { getDefaultRoleAssumerWithWebIdentity } = await Promise.resolve().then(function () { return require('./index-FXUAym5C.js'); });
        roleAssumerWithWebIdentity = getDefaultRoleAssumerWithWebIdentity({
            ...init.clientConfig,
            credentialProviderLogger: init.logger,
            parentClientConfig: init.parentClientConfig,
        }, init.clientPlugins);
    }
    return roleAssumerWithWebIdentity({
        RoleArn: roleArn,
        RoleSessionName: roleSessionName ?? `aws-sdk-js-session-${Date.now()}`,
        WebIdentityToken: webIdentityToken,
        ProviderId: providerId,
        PolicyArns: policyArns,
        Policy: policy,
        DurationSeconds: durationSeconds,
    });
};

const ENV_TOKEN_FILE = "AWS_WEB_IDENTITY_TOKEN_FILE";
const ENV_ROLE_ARN = "AWS_ROLE_ARN";
const ENV_ROLE_SESSION_NAME = "AWS_ROLE_SESSION_NAME";
const fromTokenFile = (init = {}) => async () => {
    init.logger?.debug("@aws-sdk/credential-provider-web-identity - fromTokenFile");
    const webIdentityTokenFile = init?.webIdentityTokenFile ?? process.env[ENV_TOKEN_FILE];
    const roleArn = init?.roleArn ?? process.env[ENV_ROLE_ARN];
    const roleSessionName = init?.roleSessionName ?? process.env[ENV_ROLE_SESSION_NAME];
    if (!webIdentityTokenFile || !roleArn) {
        throw new app.CredentialsProviderError("Web identity configuration not specified", {
            logger: init.logger,
        });
    }
    const credentials = await fromWebToken({
        ...init,
        webIdentityToken: fs.readFileSync(webIdentityTokenFile, { encoding: "ascii" }),
        roleArn,
        roleSessionName,
    })();
    if (webIdentityTokenFile === process.env[ENV_TOKEN_FILE]) {
        app.setCredentialFeature(credentials, "CREDENTIALS_ENV_VARS_STS_WEB_ID_TOKEN", "h");
    }
    return credentials;
};

exports.fromTokenFile = fromTokenFile;
exports.fromWebToken = fromWebToken;
