'use strict';

const rule = require('./no-uql-token');
const RuleTester = require('eslint').RuleTester;

RuleTester.setDefaultConfig({
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
    },
});

const ruleTester = new RuleTester();
ruleTester.run('no-uql-token', rule, {
    valid: [
        {
            code: 'api.defaults.headers.common[TOKEN_NAME] = Cookies.get(SESSION_COOKIE_NAME);',
        },
        {
            code: "api.defaults.headers.common[TOKEN_NAME] = 'abc123';",
        },
        {
            code: "api.default = 'something'",
        },
    ],

    invalid: [
        {
            code: "api.defaults.headers.common[TOKEN_NAME] = Cookies.get(SESSION_COOKIE_NAME) || 'aN7tH1ngLIk3t0Ken';",
            errors: [
                {
                    message: 'Please remove UQL token from conditional statement',
                    type: 'AssignmentExpression',
                },
            ],
        },
        {
            code: "api.defaults.headers.common[TOKEN_NAME] = 'aN7tH1ngLIk3t0Ken';",
            errors: [
                {
                    message: 'Please get UQL token from Cookies',
                    type: 'AssignmentExpression',
                },
            ],
        },
        {
            code: "api.defaults.headers.common[TOKEN_NAME] = 'aN7tH1ngLIk3t0Ken' || Cookies.get(SESSION_COOKIE_NAME);",
            errors: [
                {
                    message: 'Please remove UQL token from conditional statement',
                    type: 'AssignmentExpression',
                },
            ],
        },
    ],
});
