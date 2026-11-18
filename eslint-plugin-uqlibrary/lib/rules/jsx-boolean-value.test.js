const { RuleTester } = require('eslint');
const rule = require('./jsx-boolean-value');

const ruleTester = new RuleTester({
    languageOptions: {
        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },
});

ruleTester.run('jsx-boolean-value', rule, {
    valid: [
        '<Button disabled />',
        '<Button disabled={false} />',
        '<Button disabled={isDisabled} />',
        '<Button disabled={Boolean(true)} />',
        '<Button label="true" />',
        '<Button />',
    ],

    invalid: [
        {
            code: '<Button disabled={true} />',
            output: '<Button disabled />',
            errors: [
                {
                    messageId: 'useShorthand',
                },
            ],
        },
        {
            code: '<Button visible={true} />',
            output: '<Button visible />',
            errors: [
                {
                    messageId: 'useShorthand',
                },
            ],
        },
        {
            code: '<Button disabled={true} visible={true} />',
            output: '<Button disabled visible />',
            errors: [
                {
                    messageId: 'useShorthand',
                },
                {
                    messageId: 'useShorthand',
                },
            ],
        },
    ],
});
