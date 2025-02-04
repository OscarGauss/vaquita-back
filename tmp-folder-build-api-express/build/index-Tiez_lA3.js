'use strict';

require('os');
require('path');
var app = require('./app-BT8strgE.js');
require('crypto');
require('fs');
var parseKnownFiles = require('./parseKnownFiles-CWjUpGzO.js');
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
require('https');
require('http2');
require('process');
require('timers');
require('dns');
require('fs/promises');
require('tls');
require('child_process');
require('timers/promises');

const resolveCredentialSource = (credentialSource, profileName, logger) => {
    const sourceProvidersMap = {
        EcsContainer: async (options) => {
            const { fromHttp } = await Promise.resolve().then(function () { return require('./index-BcMmeiiO.js'); });
            const { fromContainerMetadata } = await Promise.resolve().then(function () { return require('./index-CtlNO4Zj.js'); });
            logger?.debug("@aws-sdk/credential-provider-ini - credential_source is EcsContainer");
            return async () => app.chain(fromHttp(options ?? {}), fromContainerMetadata(options))().then(setNamedProvider);
        },
        Ec2InstanceMetadata: async (options) => {
            logger?.debug("@aws-sdk/credential-provider-ini - credential_source is Ec2InstanceMetadata");
            const { fromInstanceMetadata } = await Promise.resolve().then(function () { return require('./index-CtlNO4Zj.js'); });
            return async () => fromInstanceMetadata(options)().then(setNamedProvider);
        },
        Environment: async (options) => {
            logger?.debug("@aws-sdk/credential-provider-ini - credential_source is Environment");
            const { fromEnv } = await Promise.resolve().then(function () { return require('./index-ChHuB5cz.js'); });
            return async () => fromEnv(options)().then(setNamedProvider);
        },
    };
    if (credentialSource in sourceProvidersMap) {
        return sourceProvidersMap[credentialSource];
    }
    else {
        throw new app.CredentialsProviderError(`Unsupported credential source in profile ${profileName}. Got ${credentialSource}, ` +
            `expected EcsContainer or Ec2InstanceMetadata or Environment.`, { logger });
    }
};
const setNamedProvider = (creds) => app.setCredentialFeature(creds, "CREDENTIALS_PROFILE_NAMED_PROVIDER", "p");

const isAssumeRoleProfile = (arg, { profile = "default", logger } = {}) => {
    return (Boolean(arg) &&
        typeof arg === "object" &&
        typeof arg.role_arn === "string" &&
        ["undefined", "string"].indexOf(typeof arg.role_session_name) > -1 &&
        ["undefined", "string"].indexOf(typeof arg.external_id) > -1 &&
        ["undefined", "string"].indexOf(typeof arg.mfa_serial) > -1 &&
        (isAssumeRoleWithSourceProfile(arg, { profile, logger }) || isCredentialSourceProfile(arg, { profile, logger })));
};
const isAssumeRoleWithSourceProfile = (arg, { profile, logger }) => {
    const withSourceProfile = typeof arg.source_profile === "string" && typeof arg.credential_source === "undefined";
    if (withSourceProfile) {
        logger?.debug?.(`    ${profile} isAssumeRoleWithSourceProfile source_profile=${arg.source_profile}`);
    }
    return withSourceProfile;
};
const isCredentialSourceProfile = (arg, { profile, logger }) => {
    const withProviderProfile = typeof arg.credential_source === "string" && typeof arg.source_profile === "undefined";
    if (withProviderProfile) {
        logger?.debug?.(`    ${profile} isCredentialSourceProfile credential_source=${arg.credential_source}`);
    }
    return withProviderProfile;
};
const resolveAssumeRoleCredentials = async (profileName, profiles, options, visitedProfiles = {}) => {
    options.logger?.debug("@aws-sdk/credential-provider-ini - resolveAssumeRoleCredentials (STS)");
    const data = profiles[profileName];
    if (!options.roleAssumer) {
        const { getDefaultRoleAssumer } = await Promise.resolve().then(function () { return require('./index-FXUAym5C.js'); });
        options.roleAssumer = getDefaultRoleAssumer({
            ...options.clientConfig,
            credentialProviderLogger: options.logger,
            parentClientConfig: options?.parentClientConfig,
        }, options.clientPlugins);
    }
    const { source_profile } = data;
    if (source_profile && source_profile in visitedProfiles) {
        throw new app.CredentialsProviderError(`Detected a cycle attempting to resolve credentials for profile` +
            ` ${app.getProfileName(options)}. Profiles visited: ` +
            Object.keys(visitedProfiles).join(", "), { logger: options.logger });
    }
    options.logger?.debug(`@aws-sdk/credential-provider-ini - finding credential resolver using ${source_profile ? `source_profile=[${source_profile}]` : `profile=[${profileName}]`}`);
    const sourceCredsProvider = source_profile
        ? resolveProfileData(source_profile, profiles, options, {
            ...visitedProfiles,
            [source_profile]: true,
        }, isCredentialSourceWithoutRoleArn(profiles[source_profile] ?? {}))
        : (await resolveCredentialSource(data.credential_source, profileName, options.logger)(options))();
    if (isCredentialSourceWithoutRoleArn(data)) {
        return sourceCredsProvider.then((creds) => app.setCredentialFeature(creds, "CREDENTIALS_PROFILE_SOURCE_PROFILE", "o"));
    }
    else {
        const params = {
            RoleArn: data.role_arn,
            RoleSessionName: data.role_session_name || `aws-sdk-js-${Date.now()}`,
            ExternalId: data.external_id,
            DurationSeconds: parseInt(data.duration_seconds || "3600", 10),
        };
        const { mfa_serial } = data;
        if (mfa_serial) {
            if (!options.mfaCodeProvider) {
                throw new app.CredentialsProviderError(`Profile ${profileName} requires multi-factor authentication, but no MFA code callback was provided.`, { logger: options.logger, tryNextLink: false });
            }
            params.SerialNumber = mfa_serial;
            params.TokenCode = await options.mfaCodeProvider(mfa_serial);
        }
        const sourceCreds = await sourceCredsProvider;
        return options.roleAssumer(sourceCreds, params).then((creds) => app.setCredentialFeature(creds, "CREDENTIALS_PROFILE_SOURCE_PROFILE", "o"));
    }
};
const isCredentialSourceWithoutRoleArn = (section) => {
    return !section.role_arn && !!section.credential_source;
};

const isProcessProfile = (arg) => Boolean(arg) && typeof arg === "object" && typeof arg.credential_process === "string";
const resolveProcessCredentials = async (options, profile) => Promise.resolve().then(function () { return require('./index-DPGBJJ7E.js'); }).then(({ fromProcess }) => fromProcess({
    ...options,
    profile,
})().then((creds) => app.setCredentialFeature(creds, "CREDENTIALS_PROFILE_PROCESS", "v")));

const resolveSsoCredentials = async (profile, profileData, options = {}) => {
    const { fromSSO } = await Promise.resolve().then(function () { return require('./index-Dyw9pQk3.js'); });
    return fromSSO({
        profile,
        logger: options.logger,
        parentClientConfig: options.parentClientConfig,
        clientConfig: options.clientConfig,
    })().then((creds) => {
        if (profileData.sso_session) {
            return app.setCredentialFeature(creds, "CREDENTIALS_PROFILE_SSO", "r");
        }
        else {
            return app.setCredentialFeature(creds, "CREDENTIALS_PROFILE_SSO_LEGACY", "t");
        }
    });
};
const isSsoProfile = (arg) => arg &&
    (typeof arg.sso_start_url === "string" ||
        typeof arg.sso_account_id === "string" ||
        typeof arg.sso_session === "string" ||
        typeof arg.sso_region === "string" ||
        typeof arg.sso_role_name === "string");

const isStaticCredsProfile = (arg) => Boolean(arg) &&
    typeof arg === "object" &&
    typeof arg.aws_access_key_id === "string" &&
    typeof arg.aws_secret_access_key === "string" &&
    ["undefined", "string"].indexOf(typeof arg.aws_session_token) > -1 &&
    ["undefined", "string"].indexOf(typeof arg.aws_account_id) > -1;
const resolveStaticCredentials = async (profile, options) => {
    options?.logger?.debug("@aws-sdk/credential-provider-ini - resolveStaticCredentials");
    const credentials = {
        accessKeyId: profile.aws_access_key_id,
        secretAccessKey: profile.aws_secret_access_key,
        sessionToken: profile.aws_session_token,
        ...(profile.aws_credential_scope && { credentialScope: profile.aws_credential_scope }),
        ...(profile.aws_account_id && { accountId: profile.aws_account_id }),
    };
    return app.setCredentialFeature(credentials, "CREDENTIALS_PROFILE", "n");
};

const isWebIdentityProfile = (arg) => Boolean(arg) &&
    typeof arg === "object" &&
    typeof arg.web_identity_token_file === "string" &&
    typeof arg.role_arn === "string" &&
    ["undefined", "string"].indexOf(typeof arg.role_session_name) > -1;
const resolveWebIdentityCredentials = async (profile, options) => Promise.resolve().then(function () { return require('./index-C1z1TjXm.js'); }).then(({ fromTokenFile }) => fromTokenFile({
    webIdentityTokenFile: profile.web_identity_token_file,
    roleArn: profile.role_arn,
    roleSessionName: profile.role_session_name,
    roleAssumerWithWebIdentity: options.roleAssumerWithWebIdentity,
    logger: options.logger,
    parentClientConfig: options.parentClientConfig,
})().then((creds) => app.setCredentialFeature(creds, "CREDENTIALS_PROFILE_STS_WEB_ID_TOKEN", "q")));

const resolveProfileData = async (profileName, profiles, options, visitedProfiles = {}, isAssumeRoleRecursiveCall = false) => {
    const data = profiles[profileName];
    if (Object.keys(visitedProfiles).length > 0 && isStaticCredsProfile(data)) {
        return resolveStaticCredentials(data, options);
    }
    if (isAssumeRoleRecursiveCall || isAssumeRoleProfile(data, { profile: profileName, logger: options.logger })) {
        return resolveAssumeRoleCredentials(profileName, profiles, options, visitedProfiles);
    }
    if (isStaticCredsProfile(data)) {
        return resolveStaticCredentials(data, options);
    }
    if (isWebIdentityProfile(data)) {
        return resolveWebIdentityCredentials(data, options);
    }
    if (isProcessProfile(data)) {
        return resolveProcessCredentials(options, profileName);
    }
    if (isSsoProfile(data)) {
        return await resolveSsoCredentials(profileName, data, options);
    }
    throw new app.CredentialsProviderError(`Could not resolve credentials using profile: [${profileName}] in configuration/credentials file(s).`, { logger: options.logger });
};

const fromIni = (init = {}) => async () => {
    init.logger?.debug("@aws-sdk/credential-provider-ini - fromIni");
    const profiles = await parseKnownFiles.parseKnownFiles(init);
    return resolveProfileData(app.getProfileName(init), profiles, init);
};

exports.fromIni = fromIni;
