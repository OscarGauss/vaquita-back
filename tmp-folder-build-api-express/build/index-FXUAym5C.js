'use strict';

var app = require('./app-BT8strgE.js');
require('buffer');
require('stream');
require('http');
require('https');
require('http2');
require('os');
require('path');
require('crypto');
require('fs');
var noAuth = require('./noAuth-ckgppMmq.js');
require('tty');
require('util');
require('net');
require('events');
require('zlib');
require('string_decoder');
require('querystring');
require('url');
require('process');
require('timers');
require('dns');
require('fs/promises');
require('tls');
require('child_process');
require('timers/promises');

const defaultSTSHttpAuthSchemeParametersProvider = async (config, context, input) => {
    return {
        operation: app.getSmithyContext(context).operation,
        region: (await app.normalizeProvider(config.region)()) ||
            (() => {
                throw new Error("expected `region` to be configured for `aws.auth#sigv4`");
            })(),
    };
};
function createAwsAuthSigv4HttpAuthOption(authParameters) {
    return {
        schemeId: "aws.auth#sigv4",
        signingProperties: {
            name: "sts",
            region: authParameters.region,
        },
        propertiesExtractor: (config, context) => ({
            signingProperties: {
                config,
                context,
            },
        }),
    };
}
function createSmithyApiNoAuthHttpAuthOption(authParameters) {
    return {
        schemeId: "smithy.api#noAuth",
    };
}
const defaultSTSHttpAuthSchemeProvider = (authParameters) => {
    const options = [];
    switch (authParameters.operation) {
        case "AssumeRoleWithSAML": {
            options.push(createSmithyApiNoAuthHttpAuthOption());
            break;
        }
        case "AssumeRoleWithWebIdentity": {
            options.push(createSmithyApiNoAuthHttpAuthOption());
            break;
        }
        default: {
            options.push(createAwsAuthSigv4HttpAuthOption(authParameters));
        }
    }
    return options;
};
const resolveStsAuthConfig = (input) => ({
    ...input,
    stsClientCtor: STSClient,
});
const resolveHttpAuthSchemeConfig = (config) => {
    const config_0 = resolveStsAuthConfig(config);
    const config_1 = app.resolveAwsSdkSigV4Config(config_0);
    return {
        ...config_1,
    };
};

const resolveClientEndpointParameters = (options) => {
    return {
        ...options,
        useDualstackEndpoint: options.useDualstackEndpoint ?? false,
        useFipsEndpoint: options.useFipsEndpoint ?? false,
        useGlobalEndpoint: options.useGlobalEndpoint ?? false,
        defaultSigningName: "sts",
    };
};
const commonParams = {
    UseGlobalEndpoint: { type: "builtInParams", name: "useGlobalEndpoint" },
    UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
    Endpoint: { type: "builtInParams", name: "endpoint" },
    Region: { type: "builtInParams", name: "region" },
    UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
};

var name = "@aws-sdk/client-sts";
var description = "AWS SDK for JavaScript Sts Client for Node.js, Browser and React Native";
var version = "3.712.0";
var scripts = {
	build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
	"build:cjs": "node ../../scripts/compilation/inline client-sts",
	"build:es": "tsc -p tsconfig.es.json",
	"build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
	"build:types": "rimraf ./dist-types tsconfig.types.tsbuildinfo && tsc -p tsconfig.types.json",
	"build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
	clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
	"extract:docs": "api-extractor run --local",
	"generate:client": "node ../../scripts/generate-clients/single-service --solo sts",
	test: "yarn g:vitest run",
	"test:watch": "yarn g:vitest watch"
};
var main = "./dist-cjs/index.js";
var types = "./dist-types/index.d.ts";
var module$1 = "./dist-es/index.js";
var sideEffects = false;
var dependencies = {
	"@aws-crypto/sha256-browser": "5.2.0",
	"@aws-crypto/sha256-js": "5.2.0",
	"@aws-sdk/client-sso-oidc": "3.712.0",
	"@aws-sdk/core": "3.709.0",
	"@aws-sdk/credential-provider-node": "3.712.0",
	"@aws-sdk/middleware-host-header": "3.709.0",
	"@aws-sdk/middleware-logger": "3.709.0",
	"@aws-sdk/middleware-recursion-detection": "3.709.0",
	"@aws-sdk/middleware-user-agent": "3.709.0",
	"@aws-sdk/region-config-resolver": "3.709.0",
	"@aws-sdk/types": "3.709.0",
	"@aws-sdk/util-endpoints": "3.709.0",
	"@aws-sdk/util-user-agent-browser": "3.709.0",
	"@aws-sdk/util-user-agent-node": "3.712.0",
	"@smithy/config-resolver": "^3.0.13",
	"@smithy/core": "^2.5.5",
	"@smithy/fetch-http-handler": "^4.1.2",
	"@smithy/hash-node": "^3.0.11",
	"@smithy/invalid-dependency": "^3.0.11",
	"@smithy/middleware-content-length": "^3.0.13",
	"@smithy/middleware-endpoint": "^3.2.5",
	"@smithy/middleware-retry": "^3.0.30",
	"@smithy/middleware-serde": "^3.0.11",
	"@smithy/middleware-stack": "^3.0.11",
	"@smithy/node-config-provider": "^3.1.12",
	"@smithy/node-http-handler": "^3.3.2",
	"@smithy/protocol-http": "^4.1.8",
	"@smithy/smithy-client": "^3.5.0",
	"@smithy/types": "^3.7.2",
	"@smithy/url-parser": "^3.0.11",
	"@smithy/util-base64": "^3.0.0",
	"@smithy/util-body-length-browser": "^3.0.0",
	"@smithy/util-body-length-node": "^3.0.0",
	"@smithy/util-defaults-mode-browser": "^3.0.30",
	"@smithy/util-defaults-mode-node": "^3.0.30",
	"@smithy/util-endpoints": "^2.1.7",
	"@smithy/util-middleware": "^3.0.11",
	"@smithy/util-retry": "^3.0.11",
	"@smithy/util-utf8": "^3.0.0",
	tslib: "^2.6.2"
};
var devDependencies = {
	"@tsconfig/node16": "16.1.3",
	"@types/node": "^16.18.96",
	concurrently: "7.0.0",
	"downlevel-dts": "0.10.1",
	rimraf: "3.0.2",
	typescript: "~4.9.5"
};
var engines = {
	node: ">=16.0.0"
};
var typesVersions = {
	"<4.0": {
		"dist-types/*": [
			"dist-types/ts3.4/*"
		]
	}
};
var files = [
	"dist-*/**"
];
var author = {
	name: "AWS SDK for JavaScript Team",
	url: "https://aws.amazon.com/javascript/"
};
var license = "Apache-2.0";
var browser = {
	"./dist-es/runtimeConfig": "./dist-es/runtimeConfig.browser"
};
var homepage = "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-sts";
var repository = {
	type: "git",
	url: "https://github.com/aws/aws-sdk-js-v3.git",
	directory: "clients/client-sts"
};
var packageInfo = {
	name: name,
	description: description,
	version: version,
	scripts: scripts,
	main: main,
	types: types,
	module: module$1,
	sideEffects: sideEffects,
	dependencies: dependencies,
	devDependencies: devDependencies,
	engines: engines,
	typesVersions: typesVersions,
	files: files,
	author: author,
	license: license,
	browser: browser,
	"react-native": {
	"./dist-es/runtimeConfig": "./dist-es/runtimeConfig.native"
},
	homepage: homepage,
	repository: repository
};

const F = "required", G = "type", H = "fn", I = "argv", J = "ref";
const a = false, b = true, c = "booleanEquals", d = "stringEquals", e = "sigv4", f = "sts", g = "us-east-1", h = "endpoint", i = "https://sts.{Region}.{PartitionResult#dnsSuffix}", j = "tree", k = "error", l = "getAttr", m = { [F]: false, [G]: "String" }, n = { [F]: true, "default": false, [G]: "Boolean" }, o = { [J]: "Endpoint" }, p = { [H]: "isSet", [I]: [{ [J]: "Region" }] }, q = { [J]: "Region" }, r = { [H]: "aws.partition", [I]: [q], "assign": "PartitionResult" }, s = { [J]: "UseFIPS" }, t = { [J]: "UseDualStack" }, u = { "url": "https://sts.amazonaws.com", "properties": { "authSchemes": [{ "name": e, "signingName": f, "signingRegion": g }] }, "headers": {} }, v = {}, w = { "conditions": [{ [H]: d, [I]: [q, "aws-global"] }], [h]: u, [G]: h }, x = { [H]: c, [I]: [s, true] }, y = { [H]: c, [I]: [t, true] }, z = { [H]: l, [I]: [{ [J]: "PartitionResult" }, "supportsFIPS"] }, A = { [J]: "PartitionResult" }, B = { [H]: c, [I]: [true, { [H]: l, [I]: [A, "supportsDualStack"] }] }, C = [{ [H]: "isSet", [I]: [o] }], D = [x], E = [y];
const _data = { version: "1.0", parameters: { Region: m, UseDualStack: n, UseFIPS: n, Endpoint: m, UseGlobalEndpoint: n }, rules: [{ conditions: [{ [H]: c, [I]: [{ [J]: "UseGlobalEndpoint" }, b] }, { [H]: "not", [I]: C }, p, r, { [H]: c, [I]: [s, a] }, { [H]: c, [I]: [t, a] }], rules: [{ conditions: [{ [H]: d, [I]: [q, "ap-northeast-1"] }], endpoint: u, [G]: h }, { conditions: [{ [H]: d, [I]: [q, "ap-south-1"] }], endpoint: u, [G]: h }, { conditions: [{ [H]: d, [I]: [q, "ap-southeast-1"] }], endpoint: u, [G]: h }, { conditions: [{ [H]: d, [I]: [q, "ap-southeast-2"] }], endpoint: u, [G]: h }, w, { conditions: [{ [H]: d, [I]: [q, "ca-central-1"] }], endpoint: u, [G]: h }, { conditions: [{ [H]: d, [I]: [q, "eu-central-1"] }], endpoint: u, [G]: h }, { conditions: [{ [H]: d, [I]: [q, "eu-north-1"] }], endpoint: u, [G]: h }, { conditions: [{ [H]: d, [I]: [q, "eu-west-1"] }], endpoint: u, [G]: h }, { conditions: [{ [H]: d, [I]: [q, "eu-west-2"] }], endpoint: u, [G]: h }, { conditions: [{ [H]: d, [I]: [q, "eu-west-3"] }], endpoint: u, [G]: h }, { conditions: [{ [H]: d, [I]: [q, "sa-east-1"] }], endpoint: u, [G]: h }, { conditions: [{ [H]: d, [I]: [q, g] }], endpoint: u, [G]: h }, { conditions: [{ [H]: d, [I]: [q, "us-east-2"] }], endpoint: u, [G]: h }, { conditions: [{ [H]: d, [I]: [q, "us-west-1"] }], endpoint: u, [G]: h }, { conditions: [{ [H]: d, [I]: [q, "us-west-2"] }], endpoint: u, [G]: h }, { endpoint: { url: i, properties: { authSchemes: [{ name: e, signingName: f, signingRegion: "{Region}" }] }, headers: v }, [G]: h }], [G]: j }, { conditions: C, rules: [{ conditions: D, error: "Invalid Configuration: FIPS and custom endpoint are not supported", [G]: k }, { conditions: E, error: "Invalid Configuration: Dualstack and custom endpoint are not supported", [G]: k }, { endpoint: { url: o, properties: v, headers: v }, [G]: h }], [G]: j }, { conditions: [p], rules: [{ conditions: [r], rules: [{ conditions: [x, y], rules: [{ conditions: [{ [H]: c, [I]: [b, z] }, B], rules: [{ endpoint: { url: "https://sts-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: v, headers: v }, [G]: h }], [G]: j }, { error: "FIPS and DualStack are enabled, but this partition does not support one or both", [G]: k }], [G]: j }, { conditions: D, rules: [{ conditions: [{ [H]: c, [I]: [z, b] }], rules: [{ conditions: [{ [H]: d, [I]: [{ [H]: l, [I]: [A, "name"] }, "aws-us-gov"] }], endpoint: { url: "https://sts.{Region}.amazonaws.com", properties: v, headers: v }, [G]: h }, { endpoint: { url: "https://sts-fips.{Region}.{PartitionResult#dnsSuffix}", properties: v, headers: v }, [G]: h }], [G]: j }, { error: "FIPS is enabled but this partition does not support FIPS", [G]: k }], [G]: j }, { conditions: E, rules: [{ conditions: [B], rules: [{ endpoint: { url: "https://sts.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: v, headers: v }, [G]: h }], [G]: j }, { error: "DualStack is enabled but this partition does not support DualStack", [G]: k }], [G]: j }, w, { endpoint: { url: i, properties: v, headers: v }, [G]: h }], [G]: j }], [G]: j }, { error: "Invalid Configuration: Missing Region", [G]: k }] };
const ruleSet = _data;

const cache = new app.EndpointCache({
    size: 50,
    params: ["Endpoint", "Region", "UseDualStack", "UseFIPS", "UseGlobalEndpoint"],
});
const defaultEndpointResolver = (endpointParams, context = {}) => {
    return cache.get(endpointParams, () => app.resolveEndpoint(ruleSet, {
        endpointParams: endpointParams,
        logger: context.logger,
    }));
};
app.customEndpointFunctions.aws = app.awsEndpointFunctions;

const getRuntimeConfig$1 = (config) => {
    return {
        apiVersion: "2011-06-15",
        base64Decoder: config?.base64Decoder ?? app.fromBase64,
        base64Encoder: config?.base64Encoder ?? app.toBase64,
        disableHostPrefix: config?.disableHostPrefix ?? false,
        endpointProvider: config?.endpointProvider ?? defaultEndpointResolver,
        extensions: config?.extensions ?? [],
        httpAuthSchemeProvider: config?.httpAuthSchemeProvider ?? defaultSTSHttpAuthSchemeProvider,
        httpAuthSchemes: config?.httpAuthSchemes ?? [
            {
                schemeId: "aws.auth#sigv4",
                identityProvider: (ipc) => ipc.getIdentityProvider("aws.auth#sigv4"),
                signer: new app.AwsSdkSigV4Signer(),
            },
            {
                schemeId: "smithy.api#noAuth",
                identityProvider: (ipc) => ipc.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
                signer: new noAuth.NoAuthSigner(),
            },
        ],
        logger: config?.logger ?? new app.NoOpLogger(),
        serviceId: config?.serviceId ?? "STS",
        urlParser: config?.urlParser ?? app.parseUrl,
        utf8Decoder: config?.utf8Decoder ?? app.fromUtf8,
        utf8Encoder: config?.utf8Encoder ?? app.toUtf8,
    };
};

const getRuntimeConfig = (config) => {
    app.emitWarningIfUnsupportedVersion(process.version);
    const defaultsMode = app.resolveDefaultsModeConfig(config);
    const defaultConfigProvider = () => defaultsMode().then(app.loadConfigsForDefaultMode);
    const clientSharedValues = getRuntimeConfig$1(config);
    app.emitWarningIfUnsupportedVersion$1(process.version);
    return {
        ...clientSharedValues,
        ...config,
        runtime: "node",
        defaultsMode,
        bodyLengthChecker: config?.bodyLengthChecker ?? app.calculateBodyLength,
        credentialDefaultProvider: config?.credentialDefaultProvider ?? app.defaultProvider,
        defaultUserAgentProvider: config?.defaultUserAgentProvider ??
            app.createDefaultUserAgentProvider({ serviceId: clientSharedValues.serviceId, clientVersion: packageInfo.version }),
        httpAuthSchemes: config?.httpAuthSchemes ?? [
            {
                schemeId: "aws.auth#sigv4",
                identityProvider: (ipc) => ipc.getIdentityProvider("aws.auth#sigv4") ||
                    (async (idProps) => await app.defaultProvider(idProps?.__config || {})()),
                signer: new app.AwsSdkSigV4Signer(),
            },
            {
                schemeId: "smithy.api#noAuth",
                identityProvider: (ipc) => ipc.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
                signer: new noAuth.NoAuthSigner(),
            },
        ],
        maxAttempts: config?.maxAttempts ?? app.loadConfig(app.NODE_MAX_ATTEMPT_CONFIG_OPTIONS),
        region: config?.region ?? app.loadConfig(app.NODE_REGION_CONFIG_OPTIONS, app.NODE_REGION_CONFIG_FILE_OPTIONS),
        requestHandler: app.NodeHttpHandler.create(config?.requestHandler ?? defaultConfigProvider),
        retryMode: config?.retryMode ??
            app.loadConfig({
                ...app.NODE_RETRY_MODE_CONFIG_OPTIONS,
                default: async () => (await defaultConfigProvider()).retryMode || app.DEFAULT_RETRY_MODE,
            }),
        sha256: config?.sha256 ?? app.Hash.bind(null, "sha256"),
        streamCollector: config?.streamCollector ?? app.streamCollector,
        useDualstackEndpoint: config?.useDualstackEndpoint ?? app.loadConfig(app.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS),
        useFipsEndpoint: config?.useFipsEndpoint ?? app.loadConfig(app.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS),
        userAgentAppId: config?.userAgentAppId ?? app.loadConfig(app.NODE_APP_ID_CONFIG_OPTIONS),
    };
};

const getHttpAuthExtensionConfiguration = (runtimeConfig) => {
    const _httpAuthSchemes = runtimeConfig.httpAuthSchemes;
    let _httpAuthSchemeProvider = runtimeConfig.httpAuthSchemeProvider;
    let _credentials = runtimeConfig.credentials;
    return {
        setHttpAuthScheme(httpAuthScheme) {
            const index = _httpAuthSchemes.findIndex((scheme) => scheme.schemeId === httpAuthScheme.schemeId);
            if (index === -1) {
                _httpAuthSchemes.push(httpAuthScheme);
            }
            else {
                _httpAuthSchemes.splice(index, 1, httpAuthScheme);
            }
        },
        httpAuthSchemes() {
            return _httpAuthSchemes;
        },
        setHttpAuthSchemeProvider(httpAuthSchemeProvider) {
            _httpAuthSchemeProvider = httpAuthSchemeProvider;
        },
        httpAuthSchemeProvider() {
            return _httpAuthSchemeProvider;
        },
        setCredentials(credentials) {
            _credentials = credentials;
        },
        credentials() {
            return _credentials;
        },
    };
};
const resolveHttpAuthRuntimeConfig = (config) => {
    return {
        httpAuthSchemes: config.httpAuthSchemes(),
        httpAuthSchemeProvider: config.httpAuthSchemeProvider(),
        credentials: config.credentials(),
    };
};

const asPartial = (t) => t;
const resolveRuntimeExtensions = (runtimeConfig, extensions) => {
    const extensionConfiguration = {
        ...asPartial(app.getAwsRegionExtensionConfiguration(runtimeConfig)),
        ...asPartial(app.getDefaultExtensionConfiguration(runtimeConfig)),
        ...asPartial(app.getHttpHandlerExtensionConfiguration(runtimeConfig)),
        ...asPartial(getHttpAuthExtensionConfiguration(runtimeConfig)),
    };
    extensions.forEach((extension) => extension.configure(extensionConfiguration));
    return {
        ...runtimeConfig,
        ...app.resolveAwsRegionExtensionConfiguration(extensionConfiguration),
        ...app.resolveDefaultRuntimeConfig(extensionConfiguration),
        ...app.resolveHttpHandlerRuntimeConfig(extensionConfiguration),
        ...resolveHttpAuthRuntimeConfig(extensionConfiguration),
    };
};

class STSClient extends app.Client {
    constructor(...[configuration]) {
        const _config_0 = getRuntimeConfig(configuration || {});
        const _config_1 = resolveClientEndpointParameters(_config_0);
        const _config_2 = app.resolveUserAgentConfig(_config_1);
        const _config_3 = app.resolveRetryConfig(_config_2);
        const _config_4 = app.resolveRegionConfig(_config_3);
        const _config_5 = app.resolveHostHeaderConfig(_config_4);
        const _config_6 = app.resolveEndpointConfig(_config_5);
        const _config_7 = resolveHttpAuthSchemeConfig(_config_6);
        const _config_8 = resolveRuntimeExtensions(_config_7, configuration?.extensions || []);
        super(_config_8);
        this.config = _config_8;
        this.middlewareStack.use(app.getUserAgentPlugin(this.config));
        this.middlewareStack.use(app.getRetryPlugin(this.config));
        this.middlewareStack.use(app.getContentLengthPlugin(this.config));
        this.middlewareStack.use(app.getHostHeaderPlugin(this.config));
        this.middlewareStack.use(app.getLoggerPlugin(this.config));
        this.middlewareStack.use(app.getRecursionDetectionPlugin(this.config));
        this.middlewareStack.use(app.getHttpAuthSchemeEndpointRuleSetPlugin(this.config, {
            httpAuthSchemeParametersProvider: defaultSTSHttpAuthSchemeParametersProvider,
            identityProviderConfigProvider: async (config) => new app.DefaultIdentityProviderConfig({
                "aws.auth#sigv4": config.credentials,
            }),
        }));
        this.middlewareStack.use(app.getHttpSigningPlugin(this.config));
    }
    destroy() {
        super.destroy();
    }
}

class STSServiceException extends app.ServiceException {
    constructor(options) {
        super(options);
        Object.setPrototypeOf(this, STSServiceException.prototype);
    }
}

class ExpiredTokenException extends STSServiceException {
    constructor(opts) {
        super({
            name: "ExpiredTokenException",
            $fault: "client",
            ...opts,
        });
        this.name = "ExpiredTokenException";
        this.$fault = "client";
        Object.setPrototypeOf(this, ExpiredTokenException.prototype);
    }
}
class MalformedPolicyDocumentException extends STSServiceException {
    constructor(opts) {
        super({
            name: "MalformedPolicyDocumentException",
            $fault: "client",
            ...opts,
        });
        this.name = "MalformedPolicyDocumentException";
        this.$fault = "client";
        Object.setPrototypeOf(this, MalformedPolicyDocumentException.prototype);
    }
}
class PackedPolicyTooLargeException extends STSServiceException {
    constructor(opts) {
        super({
            name: "PackedPolicyTooLargeException",
            $fault: "client",
            ...opts,
        });
        this.name = "PackedPolicyTooLargeException";
        this.$fault = "client";
        Object.setPrototypeOf(this, PackedPolicyTooLargeException.prototype);
    }
}
class RegionDisabledException extends STSServiceException {
    constructor(opts) {
        super({
            name: "RegionDisabledException",
            $fault: "client",
            ...opts,
        });
        this.name = "RegionDisabledException";
        this.$fault = "client";
        Object.setPrototypeOf(this, RegionDisabledException.prototype);
    }
}
class IDPRejectedClaimException extends STSServiceException {
    constructor(opts) {
        super({
            name: "IDPRejectedClaimException",
            $fault: "client",
            ...opts,
        });
        this.name = "IDPRejectedClaimException";
        this.$fault = "client";
        Object.setPrototypeOf(this, IDPRejectedClaimException.prototype);
    }
}
class InvalidIdentityTokenException extends STSServiceException {
    constructor(opts) {
        super({
            name: "InvalidIdentityTokenException",
            $fault: "client",
            ...opts,
        });
        this.name = "InvalidIdentityTokenException";
        this.$fault = "client";
        Object.setPrototypeOf(this, InvalidIdentityTokenException.prototype);
    }
}
class IDPCommunicationErrorException extends STSServiceException {
    constructor(opts) {
        super({
            name: "IDPCommunicationErrorException",
            $fault: "client",
            ...opts,
        });
        this.name = "IDPCommunicationErrorException";
        this.$fault = "client";
        Object.setPrototypeOf(this, IDPCommunicationErrorException.prototype);
    }
}
class InvalidAuthorizationMessageException extends STSServiceException {
    constructor(opts) {
        super({
            name: "InvalidAuthorizationMessageException",
            $fault: "client",
            ...opts,
        });
        this.name = "InvalidAuthorizationMessageException";
        this.$fault = "client";
        Object.setPrototypeOf(this, InvalidAuthorizationMessageException.prototype);
    }
}
const CredentialsFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.SecretAccessKey && { SecretAccessKey: app.SENSITIVE_STRING }),
});
const AssumeRoleResponseFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.Credentials && { Credentials: CredentialsFilterSensitiveLog(obj.Credentials) }),
});
const AssumeRoleWithWebIdentityRequestFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.WebIdentityToken && { WebIdentityToken: app.SENSITIVE_STRING }),
});
const AssumeRoleWithWebIdentityResponseFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.Credentials && { Credentials: CredentialsFilterSensitiveLog(obj.Credentials) }),
});

const se_AssumeRoleCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_AssumeRoleRequest(input),
        [_A]: _AR,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_AssumeRoleWithWebIdentityCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_AssumeRoleWithWebIdentityRequest(input),
        [_A]: _ARWWI,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const de_AssumeRoleCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await app.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_AssumeRoleResponse(data.AssumeRoleResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_AssumeRoleWithWebIdentityCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await app.parseXmlBody(output.body, context);
    let contents = {};
    contents = de_AssumeRoleWithWebIdentityResponse(data.AssumeRoleWithWebIdentityResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_CommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await app.parseXmlErrorBody(output.body, context),
    };
    const errorCode = loadQueryErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "ExpiredTokenException":
        case "com.amazonaws.sts#ExpiredTokenException":
            throw await de_ExpiredTokenExceptionRes(parsedOutput);
        case "MalformedPolicyDocument":
        case "com.amazonaws.sts#MalformedPolicyDocumentException":
            throw await de_MalformedPolicyDocumentExceptionRes(parsedOutput);
        case "PackedPolicyTooLarge":
        case "com.amazonaws.sts#PackedPolicyTooLargeException":
            throw await de_PackedPolicyTooLargeExceptionRes(parsedOutput);
        case "RegionDisabledException":
        case "com.amazonaws.sts#RegionDisabledException":
            throw await de_RegionDisabledExceptionRes(parsedOutput);
        case "IDPRejectedClaim":
        case "com.amazonaws.sts#IDPRejectedClaimException":
            throw await de_IDPRejectedClaimExceptionRes(parsedOutput);
        case "InvalidIdentityToken":
        case "com.amazonaws.sts#InvalidIdentityTokenException":
            throw await de_InvalidIdentityTokenExceptionRes(parsedOutput);
        case "IDPCommunicationError":
        case "com.amazonaws.sts#IDPCommunicationErrorException":
            throw await de_IDPCommunicationErrorExceptionRes(parsedOutput);
        case "InvalidAuthorizationMessageException":
        case "com.amazonaws.sts#InvalidAuthorizationMessageException":
            throw await de_InvalidAuthorizationMessageExceptionRes(parsedOutput);
        default:
            const parsedBody = parsedOutput.body;
            return throwDefaultError({
                output,
                parsedBody: parsedBody.Error,
                errorCode,
            });
    }
};
const de_ExpiredTokenExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_ExpiredTokenException(body.Error);
    const exception = new ExpiredTokenException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return app.decorateServiceException(exception, body);
};
const de_IDPCommunicationErrorExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_IDPCommunicationErrorException(body.Error);
    const exception = new IDPCommunicationErrorException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return app.decorateServiceException(exception, body);
};
const de_IDPRejectedClaimExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_IDPRejectedClaimException(body.Error);
    const exception = new IDPRejectedClaimException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return app.decorateServiceException(exception, body);
};
const de_InvalidAuthorizationMessageExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_InvalidAuthorizationMessageException(body.Error);
    const exception = new InvalidAuthorizationMessageException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return app.decorateServiceException(exception, body);
};
const de_InvalidIdentityTokenExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_InvalidIdentityTokenException(body.Error);
    const exception = new InvalidIdentityTokenException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return app.decorateServiceException(exception, body);
};
const de_MalformedPolicyDocumentExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_MalformedPolicyDocumentException(body.Error);
    const exception = new MalformedPolicyDocumentException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return app.decorateServiceException(exception, body);
};
const de_PackedPolicyTooLargeExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_PackedPolicyTooLargeException(body.Error);
    const exception = new PackedPolicyTooLargeException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return app.decorateServiceException(exception, body);
};
const de_RegionDisabledExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_RegionDisabledException(body.Error);
    const exception = new RegionDisabledException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return app.decorateServiceException(exception, body);
};
const se_AssumeRoleRequest = (input, context) => {
    const entries = {};
    if (input[_RA] != null) {
        entries[_RA] = input[_RA];
    }
    if (input[_RSN] != null) {
        entries[_RSN] = input[_RSN];
    }
    if (input[_PA] != null) {
        const memberEntries = se_policyDescriptorListType(input[_PA]);
        if (input[_PA]?.length === 0) {
            entries.PolicyArns = [];
        }
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `PolicyArns.${key}`;
            entries[loc] = value;
        });
    }
    if (input[_P] != null) {
        entries[_P] = input[_P];
    }
    if (input[_DS] != null) {
        entries[_DS] = input[_DS];
    }
    if (input[_T] != null) {
        const memberEntries = se_tagListType(input[_T]);
        if (input[_T]?.length === 0) {
            entries.Tags = [];
        }
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `Tags.${key}`;
            entries[loc] = value;
        });
    }
    if (input[_TTK] != null) {
        const memberEntries = se_tagKeyListType(input[_TTK]);
        if (input[_TTK]?.length === 0) {
            entries.TransitiveTagKeys = [];
        }
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `TransitiveTagKeys.${key}`;
            entries[loc] = value;
        });
    }
    if (input[_EI] != null) {
        entries[_EI] = input[_EI];
    }
    if (input[_SN] != null) {
        entries[_SN] = input[_SN];
    }
    if (input[_TC] != null) {
        entries[_TC] = input[_TC];
    }
    if (input[_SI] != null) {
        entries[_SI] = input[_SI];
    }
    if (input[_PC] != null) {
        const memberEntries = se_ProvidedContextsListType(input[_PC]);
        if (input[_PC]?.length === 0) {
            entries.ProvidedContexts = [];
        }
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `ProvidedContexts.${key}`;
            entries[loc] = value;
        });
    }
    return entries;
};
const se_AssumeRoleWithWebIdentityRequest = (input, context) => {
    const entries = {};
    if (input[_RA] != null) {
        entries[_RA] = input[_RA];
    }
    if (input[_RSN] != null) {
        entries[_RSN] = input[_RSN];
    }
    if (input[_WIT] != null) {
        entries[_WIT] = input[_WIT];
    }
    if (input[_PI] != null) {
        entries[_PI] = input[_PI];
    }
    if (input[_PA] != null) {
        const memberEntries = se_policyDescriptorListType(input[_PA]);
        if (input[_PA]?.length === 0) {
            entries.PolicyArns = [];
        }
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `PolicyArns.${key}`;
            entries[loc] = value;
        });
    }
    if (input[_P] != null) {
        entries[_P] = input[_P];
    }
    if (input[_DS] != null) {
        entries[_DS] = input[_DS];
    }
    return entries;
};
const se_policyDescriptorListType = (input, context) => {
    const entries = {};
    let counter = 1;
    for (const entry of input) {
        if (entry === null) {
            continue;
        }
        const memberEntries = se_PolicyDescriptorType(entry);
        Object.entries(memberEntries).forEach(([key, value]) => {
            entries[`member.${counter}.${key}`] = value;
        });
        counter++;
    }
    return entries;
};
const se_PolicyDescriptorType = (input, context) => {
    const entries = {};
    if (input[_a] != null) {
        entries[_a] = input[_a];
    }
    return entries;
};
const se_ProvidedContext = (input, context) => {
    const entries = {};
    if (input[_PAro] != null) {
        entries[_PAro] = input[_PAro];
    }
    if (input[_CA] != null) {
        entries[_CA] = input[_CA];
    }
    return entries;
};
const se_ProvidedContextsListType = (input, context) => {
    const entries = {};
    let counter = 1;
    for (const entry of input) {
        if (entry === null) {
            continue;
        }
        const memberEntries = se_ProvidedContext(entry);
        Object.entries(memberEntries).forEach(([key, value]) => {
            entries[`member.${counter}.${key}`] = value;
        });
        counter++;
    }
    return entries;
};
const se_Tag = (input, context) => {
    const entries = {};
    if (input[_K] != null) {
        entries[_K] = input[_K];
    }
    if (input[_Va] != null) {
        entries[_Va] = input[_Va];
    }
    return entries;
};
const se_tagKeyListType = (input, context) => {
    const entries = {};
    let counter = 1;
    for (const entry of input) {
        if (entry === null) {
            continue;
        }
        entries[`member.${counter}`] = entry;
        counter++;
    }
    return entries;
};
const se_tagListType = (input, context) => {
    const entries = {};
    let counter = 1;
    for (const entry of input) {
        if (entry === null) {
            continue;
        }
        const memberEntries = se_Tag(entry);
        Object.entries(memberEntries).forEach(([key, value]) => {
            entries[`member.${counter}.${key}`] = value;
        });
        counter++;
    }
    return entries;
};
const de_AssumedRoleUser = (output, context) => {
    const contents = {};
    if (output[_ARI] != null) {
        contents[_ARI] = app.expectString(output[_ARI]);
    }
    if (output[_Ar] != null) {
        contents[_Ar] = app.expectString(output[_Ar]);
    }
    return contents;
};
const de_AssumeRoleResponse = (output, context) => {
    const contents = {};
    if (output[_C] != null) {
        contents[_C] = de_Credentials(output[_C]);
    }
    if (output[_ARU] != null) {
        contents[_ARU] = de_AssumedRoleUser(output[_ARU]);
    }
    if (output[_PPS] != null) {
        contents[_PPS] = app.strictParseInt32(output[_PPS]);
    }
    if (output[_SI] != null) {
        contents[_SI] = app.expectString(output[_SI]);
    }
    return contents;
};
const de_AssumeRoleWithWebIdentityResponse = (output, context) => {
    const contents = {};
    if (output[_C] != null) {
        contents[_C] = de_Credentials(output[_C]);
    }
    if (output[_SFWIT] != null) {
        contents[_SFWIT] = app.expectString(output[_SFWIT]);
    }
    if (output[_ARU] != null) {
        contents[_ARU] = de_AssumedRoleUser(output[_ARU]);
    }
    if (output[_PPS] != null) {
        contents[_PPS] = app.strictParseInt32(output[_PPS]);
    }
    if (output[_Pr] != null) {
        contents[_Pr] = app.expectString(output[_Pr]);
    }
    if (output[_Au] != null) {
        contents[_Au] = app.expectString(output[_Au]);
    }
    if (output[_SI] != null) {
        contents[_SI] = app.expectString(output[_SI]);
    }
    return contents;
};
const de_Credentials = (output, context) => {
    const contents = {};
    if (output[_AKI] != null) {
        contents[_AKI] = app.expectString(output[_AKI]);
    }
    if (output[_SAK] != null) {
        contents[_SAK] = app.expectString(output[_SAK]);
    }
    if (output[_STe] != null) {
        contents[_STe] = app.expectString(output[_STe]);
    }
    if (output[_E] != null) {
        contents[_E] = app.expectNonNull(app.parseRfc3339DateTimeWithOffset(output[_E]));
    }
    return contents;
};
const de_ExpiredTokenException = (output, context) => {
    const contents = {};
    if (output[_m] != null) {
        contents[_m] = app.expectString(output[_m]);
    }
    return contents;
};
const de_IDPCommunicationErrorException = (output, context) => {
    const contents = {};
    if (output[_m] != null) {
        contents[_m] = app.expectString(output[_m]);
    }
    return contents;
};
const de_IDPRejectedClaimException = (output, context) => {
    const contents = {};
    if (output[_m] != null) {
        contents[_m] = app.expectString(output[_m]);
    }
    return contents;
};
const de_InvalidAuthorizationMessageException = (output, context) => {
    const contents = {};
    if (output[_m] != null) {
        contents[_m] = app.expectString(output[_m]);
    }
    return contents;
};
const de_InvalidIdentityTokenException = (output, context) => {
    const contents = {};
    if (output[_m] != null) {
        contents[_m] = app.expectString(output[_m]);
    }
    return contents;
};
const de_MalformedPolicyDocumentException = (output, context) => {
    const contents = {};
    if (output[_m] != null) {
        contents[_m] = app.expectString(output[_m]);
    }
    return contents;
};
const de_PackedPolicyTooLargeException = (output, context) => {
    const contents = {};
    if (output[_m] != null) {
        contents[_m] = app.expectString(output[_m]);
    }
    return contents;
};
const de_RegionDisabledException = (output, context) => {
    const contents = {};
    if (output[_m] != null) {
        contents[_m] = app.expectString(output[_m]);
    }
    return contents;
};
const deserializeMetadata = (output) => ({
    httpStatusCode: output.statusCode,
    requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
    extendedRequestId: output.headers["x-amz-id-2"],
    cfId: output.headers["x-amz-cf-id"],
});
const throwDefaultError = app.withBaseException(STSServiceException);
const buildHttpRpcRequest = async (context, headers, path, resolvedHostname, body) => {
    const { hostname, protocol = "https", port, path: basePath } = await context.endpoint();
    const contents = {
        protocol,
        hostname,
        port,
        method: "POST",
        path: basePath.endsWith("/") ? basePath.slice(0, -1) + path : basePath + path,
        headers,
    };
    if (body !== undefined) {
        contents.body = body;
    }
    return new app.HttpRequest(contents);
};
const SHARED_HEADERS = {
    "content-type": "application/x-www-form-urlencoded",
};
const _ = "2011-06-15";
const _A = "Action";
const _AKI = "AccessKeyId";
const _AR = "AssumeRole";
const _ARI = "AssumedRoleId";
const _ARU = "AssumedRoleUser";
const _ARWWI = "AssumeRoleWithWebIdentity";
const _Ar = "Arn";
const _Au = "Audience";
const _C = "Credentials";
const _CA = "ContextAssertion";
const _DS = "DurationSeconds";
const _E = "Expiration";
const _EI = "ExternalId";
const _K = "Key";
const _P = "Policy";
const _PA = "PolicyArns";
const _PAro = "ProviderArn";
const _PC = "ProvidedContexts";
const _PI = "ProviderId";
const _PPS = "PackedPolicySize";
const _Pr = "Provider";
const _RA = "RoleArn";
const _RSN = "RoleSessionName";
const _SAK = "SecretAccessKey";
const _SFWIT = "SubjectFromWebIdentityToken";
const _SI = "SourceIdentity";
const _SN = "SerialNumber";
const _STe = "SessionToken";
const _T = "Tags";
const _TC = "TokenCode";
const _TTK = "TransitiveTagKeys";
const _V = "Version";
const _Va = "Value";
const _WIT = "WebIdentityToken";
const _a = "arn";
const _m = "message";
const buildFormUrlencodedString = (formEntries) => Object.entries(formEntries)
    .map(([key, value]) => app.extendedEncodeURIComponent(key) + "=" + app.extendedEncodeURIComponent(value))
    .join("&");
const loadQueryErrorCode = (output, data) => {
    if (data.Error?.Code !== undefined) {
        return data.Error.Code;
    }
    if (output.statusCode == 404) {
        return "NotFound";
    }
};

class AssumeRoleCommand extends app.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        app.getSerdePlugin(config, this.serialize, this.deserialize),
        app.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("AWSSecurityTokenServiceV20110615", "AssumeRole", {})
    .n("STSClient", "AssumeRoleCommand")
    .f(void 0, AssumeRoleResponseFilterSensitiveLog)
    .ser(se_AssumeRoleCommand)
    .de(de_AssumeRoleCommand)
    .build() {
}

class AssumeRoleWithWebIdentityCommand extends app.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        app.getSerdePlugin(config, this.serialize, this.deserialize),
        app.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("AWSSecurityTokenServiceV20110615", "AssumeRoleWithWebIdentity", {})
    .n("STSClient", "AssumeRoleWithWebIdentityCommand")
    .f(AssumeRoleWithWebIdentityRequestFilterSensitiveLog, AssumeRoleWithWebIdentityResponseFilterSensitiveLog)
    .ser(se_AssumeRoleWithWebIdentityCommand)
    .de(de_AssumeRoleWithWebIdentityCommand)
    .build() {
}

const ASSUME_ROLE_DEFAULT_REGION = "us-east-1";
const getAccountIdFromAssumedRoleUser = (assumedRoleUser) => {
    if (typeof assumedRoleUser?.Arn === "string") {
        const arnComponents = assumedRoleUser.Arn.split(":");
        if (arnComponents.length > 4 && arnComponents[4] !== "") {
            return arnComponents[4];
        }
    }
    return undefined;
};
const resolveRegion = async (_region, _parentRegion, credentialProviderLogger) => {
    const region = typeof _region === "function" ? await _region() : _region;
    const parentRegion = typeof _parentRegion === "function" ? await _parentRegion() : _parentRegion;
    credentialProviderLogger?.debug?.("@aws-sdk/client-sts::resolveRegion", "accepting first of:", `${region} (provider)`, `${parentRegion} (parent client)`, `${ASSUME_ROLE_DEFAULT_REGION} (STS default)`);
    return region ?? parentRegion ?? ASSUME_ROLE_DEFAULT_REGION;
};
const getDefaultRoleAssumer$1 = (stsOptions, stsClientCtor) => {
    let stsClient;
    let closureSourceCreds;
    return async (sourceCreds, params) => {
        closureSourceCreds = sourceCreds;
        if (!stsClient) {
            const { logger = stsOptions?.parentClientConfig?.logger, region, requestHandler = stsOptions?.parentClientConfig?.requestHandler, credentialProviderLogger, } = stsOptions;
            const resolvedRegion = await resolveRegion(region, stsOptions?.parentClientConfig?.region, credentialProviderLogger);
            const isCompatibleRequestHandler = !isH2(requestHandler);
            stsClient = new stsClientCtor({
                credentialDefaultProvider: () => async () => closureSourceCreds,
                region: resolvedRegion,
                requestHandler: isCompatibleRequestHandler ? requestHandler : undefined,
                logger: logger,
            });
        }
        const { Credentials, AssumedRoleUser } = await stsClient.send(new AssumeRoleCommand(params));
        if (!Credentials || !Credentials.AccessKeyId || !Credentials.SecretAccessKey) {
            throw new Error(`Invalid response from STS.assumeRole call with role ${params.RoleArn}`);
        }
        const accountId = getAccountIdFromAssumedRoleUser(AssumedRoleUser);
        const credentials = {
            accessKeyId: Credentials.AccessKeyId,
            secretAccessKey: Credentials.SecretAccessKey,
            sessionToken: Credentials.SessionToken,
            expiration: Credentials.Expiration,
            ...(Credentials.CredentialScope && { credentialScope: Credentials.CredentialScope }),
            ...(accountId && { accountId }),
        };
        app.setCredentialFeature(credentials, "CREDENTIALS_STS_ASSUME_ROLE", "i");
        return credentials;
    };
};
const getDefaultRoleAssumerWithWebIdentity$1 = (stsOptions, stsClientCtor) => {
    let stsClient;
    return async (params) => {
        if (!stsClient) {
            const { logger = stsOptions?.parentClientConfig?.logger, region, requestHandler = stsOptions?.parentClientConfig?.requestHandler, credentialProviderLogger, } = stsOptions;
            const resolvedRegion = await resolveRegion(region, stsOptions?.parentClientConfig?.region, credentialProviderLogger);
            const isCompatibleRequestHandler = !isH2(requestHandler);
            stsClient = new stsClientCtor({
                region: resolvedRegion,
                requestHandler: isCompatibleRequestHandler ? requestHandler : undefined,
                logger: logger,
            });
        }
        const { Credentials, AssumedRoleUser } = await stsClient.send(new AssumeRoleWithWebIdentityCommand(params));
        if (!Credentials || !Credentials.AccessKeyId || !Credentials.SecretAccessKey) {
            throw new Error(`Invalid response from STS.assumeRoleWithWebIdentity call with role ${params.RoleArn}`);
        }
        const accountId = getAccountIdFromAssumedRoleUser(AssumedRoleUser);
        const credentials = {
            accessKeyId: Credentials.AccessKeyId,
            secretAccessKey: Credentials.SecretAccessKey,
            sessionToken: Credentials.SessionToken,
            expiration: Credentials.Expiration,
            ...(Credentials.CredentialScope && { credentialScope: Credentials.CredentialScope }),
            ...(accountId && { accountId }),
        };
        if (accountId) {
            app.setCredentialFeature(credentials, "RESOLVED_ACCOUNT_ID", "T");
        }
        app.setCredentialFeature(credentials, "CREDENTIALS_STS_ASSUME_ROLE_WEB_ID", "k");
        return credentials;
    };
};
const isH2 = (requestHandler) => {
    return requestHandler?.metadata?.handlerProtocol === "h2";
};

const getCustomizableStsClientCtor = (baseCtor, customizations) => {
    if (!customizations)
        return baseCtor;
    else
        return class CustomizableSTSClient extends baseCtor {
            constructor(config) {
                super(config);
                for (const customization of customizations) {
                    this.middlewareStack.use(customization);
                }
            }
        };
};
const getDefaultRoleAssumer = (stsOptions = {}, stsPlugins) => getDefaultRoleAssumer$1(stsOptions, getCustomizableStsClientCtor(STSClient, stsPlugins));
const getDefaultRoleAssumerWithWebIdentity = (stsOptions = {}, stsPlugins) => getDefaultRoleAssumerWithWebIdentity$1(stsOptions, getCustomizableStsClientCtor(STSClient, stsPlugins));

exports.$Command = app.Command;
exports.__Client = app.Client;
exports.AssumeRoleCommand = AssumeRoleCommand;
exports.AssumeRoleResponseFilterSensitiveLog = AssumeRoleResponseFilterSensitiveLog;
exports.AssumeRoleWithWebIdentityCommand = AssumeRoleWithWebIdentityCommand;
exports.AssumeRoleWithWebIdentityRequestFilterSensitiveLog = AssumeRoleWithWebIdentityRequestFilterSensitiveLog;
exports.AssumeRoleWithWebIdentityResponseFilterSensitiveLog = AssumeRoleWithWebIdentityResponseFilterSensitiveLog;
exports.CredentialsFilterSensitiveLog = CredentialsFilterSensitiveLog;
exports.ExpiredTokenException = ExpiredTokenException;
exports.IDPCommunicationErrorException = IDPCommunicationErrorException;
exports.IDPRejectedClaimException = IDPRejectedClaimException;
exports.InvalidAuthorizationMessageException = InvalidAuthorizationMessageException;
exports.InvalidIdentityTokenException = InvalidIdentityTokenException;
exports.MalformedPolicyDocumentException = MalformedPolicyDocumentException;
exports.PackedPolicyTooLargeException = PackedPolicyTooLargeException;
exports.RegionDisabledException = RegionDisabledException;
exports.STSClient = STSClient;
exports.STSServiceException = STSServiceException;
exports.getDefaultRoleAssumer = getDefaultRoleAssumer;
exports.getDefaultRoleAssumerWithWebIdentity = getDefaultRoleAssumerWithWebIdentity;
