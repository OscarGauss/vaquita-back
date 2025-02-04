'use strict';

require('os');
require('path');
require('crypto');
require('fs');
var app = require('./app-BT8strgE.js');
require('buffer');
require('stream');
require('http');
require('https');
require('http2');
var parseJsonBody = require('./parseJsonBody-DyQKTwkk.js');
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

const defaultSSOHttpAuthSchemeParametersProvider = async (config, context, input) => {
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
            name: "awsssoportal",
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
const defaultSSOHttpAuthSchemeProvider = (authParameters) => {
    const options = [];
    switch (authParameters.operation) {
        case "GetRoleCredentials": {
            options.push(createSmithyApiNoAuthHttpAuthOption());
            break;
        }
        case "ListAccountRoles": {
            options.push(createSmithyApiNoAuthHttpAuthOption());
            break;
        }
        case "ListAccounts": {
            options.push(createSmithyApiNoAuthHttpAuthOption());
            break;
        }
        case "Logout": {
            options.push(createSmithyApiNoAuthHttpAuthOption());
            break;
        }
        default: {
            options.push(createAwsAuthSigv4HttpAuthOption(authParameters));
        }
    }
    return options;
};
const resolveHttpAuthSchemeConfig = (config) => {
    const config_0 = app.resolveAwsSdkSigV4Config(config);
    return {
        ...config_0,
    };
};

const resolveClientEndpointParameters = (options) => {
    return {
        ...options,
        useDualstackEndpoint: options.useDualstackEndpoint ?? false,
        useFipsEndpoint: options.useFipsEndpoint ?? false,
        defaultSigningName: "awsssoportal",
    };
};
const commonParams = {
    UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
    Endpoint: { type: "builtInParams", name: "endpoint" },
    Region: { type: "builtInParams", name: "region" },
    UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
};

var name = "@aws-sdk/client-sso";
var description = "AWS SDK for JavaScript Sso Client for Node.js, Browser and React Native";
var version = "3.712.0";
var scripts = {
	build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
	"build:cjs": "node ../../scripts/compilation/inline client-sso",
	"build:es": "tsc -p tsconfig.es.json",
	"build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
	"build:types": "tsc -p tsconfig.types.json",
	"build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
	clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
	"extract:docs": "api-extractor run --local",
	"generate:client": "node ../../scripts/generate-clients/single-service --solo sso"
};
var main = "./dist-cjs/index.js";
var types = "./dist-types/index.d.ts";
var module$1 = "./dist-es/index.js";
var sideEffects = false;
var dependencies = {
	"@aws-crypto/sha256-browser": "5.2.0",
	"@aws-crypto/sha256-js": "5.2.0",
	"@aws-sdk/core": "3.709.0",
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
var homepage = "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-sso";
var repository = {
	type: "git",
	url: "https://github.com/aws/aws-sdk-js-v3.git",
	directory: "clients/client-sso"
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

const u = "required", v = "fn", w = "argv", x = "ref";
const a = true, b = "isSet", c = "booleanEquals", d = "error", e = "endpoint", f = "tree", g = "PartitionResult", h = "getAttr", i = { [u]: false, "type": "String" }, j = { [u]: true, "default": false, "type": "Boolean" }, k = { [x]: "Endpoint" }, l = { [v]: c, [w]: [{ [x]: "UseFIPS" }, true] }, m = { [v]: c, [w]: [{ [x]: "UseDualStack" }, true] }, n = {}, o = { [v]: h, [w]: [{ [x]: g }, "supportsFIPS"] }, p = { [x]: g }, q = { [v]: c, [w]: [true, { [v]: h, [w]: [p, "supportsDualStack"] }] }, r = [l], s = [m], t = [{ [x]: "Region" }];
const _data = { version: "1.0", parameters: { Region: i, UseDualStack: j, UseFIPS: j, Endpoint: i }, rules: [{ conditions: [{ [v]: b, [w]: [k] }], rules: [{ conditions: r, error: "Invalid Configuration: FIPS and custom endpoint are not supported", type: d }, { conditions: s, error: "Invalid Configuration: Dualstack and custom endpoint are not supported", type: d }, { endpoint: { url: k, properties: n, headers: n }, type: e }], type: f }, { conditions: [{ [v]: b, [w]: t }], rules: [{ conditions: [{ [v]: "aws.partition", [w]: t, assign: g }], rules: [{ conditions: [l, m], rules: [{ conditions: [{ [v]: c, [w]: [a, o] }, q], rules: [{ endpoint: { url: "https://portal.sso-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: n, headers: n }, type: e }], type: f }, { error: "FIPS and DualStack are enabled, but this partition does not support one or both", type: d }], type: f }, { conditions: r, rules: [{ conditions: [{ [v]: c, [w]: [o, a] }], rules: [{ conditions: [{ [v]: "stringEquals", [w]: [{ [v]: h, [w]: [p, "name"] }, "aws-us-gov"] }], endpoint: { url: "https://portal.sso.{Region}.amazonaws.com", properties: n, headers: n }, type: e }, { endpoint: { url: "https://portal.sso-fips.{Region}.{PartitionResult#dnsSuffix}", properties: n, headers: n }, type: e }], type: f }, { error: "FIPS is enabled but this partition does not support FIPS", type: d }], type: f }, { conditions: s, rules: [{ conditions: [q], rules: [{ endpoint: { url: "https://portal.sso.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: n, headers: n }, type: e }], type: f }, { error: "DualStack is enabled but this partition does not support DualStack", type: d }], type: f }, { endpoint: { url: "https://portal.sso.{Region}.{PartitionResult#dnsSuffix}", properties: n, headers: n }, type: e }], type: f }], type: f }, { error: "Invalid Configuration: Missing Region", type: d }] };
const ruleSet = _data;

const cache = new app.EndpointCache({
    size: 50,
    params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"],
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
        apiVersion: "2019-06-10",
        base64Decoder: config?.base64Decoder ?? app.fromBase64,
        base64Encoder: config?.base64Encoder ?? app.toBase64,
        disableHostPrefix: config?.disableHostPrefix ?? false,
        endpointProvider: config?.endpointProvider ?? defaultEndpointResolver,
        extensions: config?.extensions ?? [],
        httpAuthSchemeProvider: config?.httpAuthSchemeProvider ?? defaultSSOHttpAuthSchemeProvider,
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
        serviceId: config?.serviceId ?? "SSO",
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
        defaultUserAgentProvider: config?.defaultUserAgentProvider ??
            app.createDefaultUserAgentProvider({ serviceId: clientSharedValues.serviceId, clientVersion: packageInfo.version }),
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

class SSOClient extends app.Client {
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
            httpAuthSchemeParametersProvider: defaultSSOHttpAuthSchemeParametersProvider,
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

class SSOServiceException extends app.ServiceException {
    constructor(options) {
        super(options);
        Object.setPrototypeOf(this, SSOServiceException.prototype);
    }
}

class InvalidRequestException extends SSOServiceException {
    constructor(opts) {
        super({
            name: "InvalidRequestException",
            $fault: "client",
            ...opts,
        });
        this.name = "InvalidRequestException";
        this.$fault = "client";
        Object.setPrototypeOf(this, InvalidRequestException.prototype);
    }
}
class ResourceNotFoundException extends SSOServiceException {
    constructor(opts) {
        super({
            name: "ResourceNotFoundException",
            $fault: "client",
            ...opts,
        });
        this.name = "ResourceNotFoundException";
        this.$fault = "client";
        Object.setPrototypeOf(this, ResourceNotFoundException.prototype);
    }
}
class TooManyRequestsException extends SSOServiceException {
    constructor(opts) {
        super({
            name: "TooManyRequestsException",
            $fault: "client",
            ...opts,
        });
        this.name = "TooManyRequestsException";
        this.$fault = "client";
        Object.setPrototypeOf(this, TooManyRequestsException.prototype);
    }
}
class UnauthorizedException extends SSOServiceException {
    constructor(opts) {
        super({
            name: "UnauthorizedException",
            $fault: "client",
            ...opts,
        });
        this.name = "UnauthorizedException";
        this.$fault = "client";
        Object.setPrototypeOf(this, UnauthorizedException.prototype);
    }
}
const GetRoleCredentialsRequestFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.accessToken && { accessToken: app.SENSITIVE_STRING }),
});
const RoleCredentialsFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.secretAccessKey && { secretAccessKey: app.SENSITIVE_STRING }),
    ...(obj.sessionToken && { sessionToken: app.SENSITIVE_STRING }),
});
const GetRoleCredentialsResponseFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.roleCredentials && { roleCredentials: RoleCredentialsFilterSensitiveLog(obj.roleCredentials) }),
});

const se_GetRoleCredentialsCommand = async (input, context) => {
    const b = app.requestBuilder(input, context);
    const headers = app.map({}, app.isSerializableHeaderValue, {
        [_xasbt]: input[_aT],
    });
    b.bp("/federation/credentials");
    const query = app.map({
        [_rn]: [, app.expectNonNull(input[_rN], `roleName`)],
        [_ai]: [, app.expectNonNull(input[_aI], `accountId`)],
    });
    let body;
    b.m("GET").h(headers).q(query).b(body);
    return b.build();
};
const de_GetRoleCredentialsCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = app.map({
        $metadata: deserializeMetadata(output),
    });
    const data = app.expectNonNull(app.expectObject(await parseJsonBody.parseJsonBody(output.body, context)), "body");
    const doc = app.take(data, {
        roleCredentials: parseJsonBody._json,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_CommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseJsonBody.parseJsonErrorBody(output.body, context),
    };
    const errorCode = parseJsonBody.loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InvalidRequestException":
        case "com.amazonaws.sso#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput);
        case "ResourceNotFoundException":
        case "com.amazonaws.sso#ResourceNotFoundException":
            throw await de_ResourceNotFoundExceptionRes(parsedOutput);
        case "TooManyRequestsException":
        case "com.amazonaws.sso#TooManyRequestsException":
            throw await de_TooManyRequestsExceptionRes(parsedOutput);
        case "UnauthorizedException":
        case "com.amazonaws.sso#UnauthorizedException":
            throw await de_UnauthorizedExceptionRes(parsedOutput);
        default:
            const parsedBody = parsedOutput.body;
            return throwDefaultError({
                output,
                parsedBody,
                errorCode,
            });
    }
};
const throwDefaultError = app.withBaseException(SSOServiceException);
const de_InvalidRequestExceptionRes = async (parsedOutput, context) => {
    const contents = app.map({});
    const data = parsedOutput.body;
    const doc = app.take(data, {
        message: app.expectString,
    });
    Object.assign(contents, doc);
    const exception = new InvalidRequestException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return app.decorateServiceException(exception, parsedOutput.body);
};
const de_ResourceNotFoundExceptionRes = async (parsedOutput, context) => {
    const contents = app.map({});
    const data = parsedOutput.body;
    const doc = app.take(data, {
        message: app.expectString,
    });
    Object.assign(contents, doc);
    const exception = new ResourceNotFoundException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return app.decorateServiceException(exception, parsedOutput.body);
};
const de_TooManyRequestsExceptionRes = async (parsedOutput, context) => {
    const contents = app.map({});
    const data = parsedOutput.body;
    const doc = app.take(data, {
        message: app.expectString,
    });
    Object.assign(contents, doc);
    const exception = new TooManyRequestsException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return app.decorateServiceException(exception, parsedOutput.body);
};
const de_UnauthorizedExceptionRes = async (parsedOutput, context) => {
    const contents = app.map({});
    const data = parsedOutput.body;
    const doc = app.take(data, {
        message: app.expectString,
    });
    Object.assign(contents, doc);
    const exception = new UnauthorizedException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return app.decorateServiceException(exception, parsedOutput.body);
};
const deserializeMetadata = (output) => ({
    httpStatusCode: output.statusCode,
    requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
    extendedRequestId: output.headers["x-amz-id-2"],
    cfId: output.headers["x-amz-cf-id"],
});
const _aI = "accountId";
const _aT = "accessToken";
const _ai = "account_id";
const _rN = "roleName";
const _rn = "role_name";
const _xasbt = "x-amz-sso_bearer_token";

class GetRoleCredentialsCommand extends app.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        app.getSerdePlugin(config, this.serialize, this.deserialize),
        app.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SWBPortalService", "GetRoleCredentials", {})
    .n("SSOClient", "GetRoleCredentialsCommand")
    .f(GetRoleCredentialsRequestFilterSensitiveLog, GetRoleCredentialsResponseFilterSensitiveLog)
    .ser(se_GetRoleCredentialsCommand)
    .de(de_GetRoleCredentialsCommand)
    .build() {
}

exports.GetRoleCredentialsCommand = GetRoleCredentialsCommand;
exports.SSOClient = SSOClient;
