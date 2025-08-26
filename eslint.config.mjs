import { defineConfig, globalIgnores } from "eslint/config";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11Y from "eslint-plugin-jsx-a11y";
import uqlibrary from "eslint-plugin-uqlibrary";
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import stylistic from '@stylistic/eslint-plugin'
import globals from "globals";
import babelParser from "@babel/eslint-parser";
import tseslint from 'typescript-eslint';
import js from "@eslint/js";

import path from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([
    globalIgnores([
        "**/__mocks__",
        "**/.idea",
        "**/.vscode",
        "**/bin",
        "**/coverage",
        "**/custom_modules",
        "**/dist",
        "**/node_modules",
        "**/scripts",
        "**/mock/data/**/*.js",
    ]),
    {
        plugins: {
            react,
            "react-hooks": reactHooks,
            "jsx-a11y": jsxA11Y,
            "@stylistic": stylistic,
            uqlibrary,
        },

        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.mocha,
                __DEV__: true,
                afterAll: true,
                beforeAll: true,
                expect: true,
                getElement: true,
                renderComponent: true,
                componentToString: true,
                jasmine: true,
                jest: true,
                mockActionsStore: true,
                mockApi: true,
                mockSessionApi: true,
                setupMockAdapter: true,
                setupSessionMockAdapter: true,
                setupStoreForActions: true,
                sinon: true,
                toJson: true,
                dd: true,
                dc: true,
                dj: true,
            },

            parser: babelParser,
            ecmaVersion: 6,
            sourceType: "module",

            parserOptions: {
                requireConfigFile: false,
                ecmaFeatures: {
                    jsx: true,
                },
                babelOptions: {
                    presets: ["@babel/preset-react"],
                },
            },
        },

        settings: {
            react: {
                version: "detect",
            },
        },

        rules: {
            "no-restricted-imports": ["error", {
                patterns: ["@mui/*/*/*"], // https://mui.com/material-ui/guides/minimizing-bundle-size/#option-two-use-a-babel-plugin
            }],

            "no-var": 2,
            "prefer-const": 2,
            "no-undef": 2,

            /**
             * Variables
             */
            "no-unused-vars": [2, {
                vars: "local",
                args: "after-used",
                caughtErrors: 'none',
            }],

            "no-use-before-define": 2,

            /**
             * Possible errors
             */
            "no-cond-assign": [2, "always"],
            "no-debugger": 1,
            "no-constant-condition": 1,
            "no-dupe-keys": 2,
            "no-duplicate-case": 2,
            "no-empty": [2, { "allowEmptyCatch": true }],
            "no-ex-assign": 2,
            "no-extra-boolean-cast": 0,
            "no-extra-semi": 2,
            "no-func-assign": 2,
            "no-inner-declarations": 2,
            "no-invalid-regexp": 2,
            "no-irregular-whitespace": 2,
            "no-obj-calls": 2,
            "no-sparse-arrays": 2,
            "no-unreachable": 2,
            "use-isnan": 2,
            "block-scoped-var": 2,

            /**
             * Best practices
             */
            "consistent-return": 2,

            curly: [2, "multi-line"],

            "default-case": 2,
            "dot-notation": [2, {
                allowKeywords: true,
            }],

            eqeqeq: 2,
            "guard-for-in": 2,
            "no-caller": 2,
            "no-eq-null": 2,
            "no-eval": 2,
            "no-extend-native": 2,
            "no-extra-bind": 2,
            "no-fallthrough": 2,
            "no-floating-decimal": 2,
            "no-implied-eval": 2,
            "no-lone-blocks": 2,
            "no-loop-func": 2,
            "no-multi-str": 2,
            "no-native-reassign": 2,
            "no-new": 2,
            "no-new-func": 2,
            "no-new-wrappers": 2,
            "no-octal": 2,
            "no-octal-escape": 2,
            "no-param-reassign": 2,
            "no-proto": 2,
            "no-redeclare": 2,
            "no-return-assign": 2,
            "no-script-url": 2,
            "no-self-compare": 2,
            "no-sequences": 2,
            "no-with": 2,
            radix: 2,
            "vars-on-top": 2,
            yoda: 2,

            /**
             * React
             */
            "jsx-quotes": [2, "prefer-double"],
            "react/display-name": 0,
            "react/jsx-boolean-value": 1,
            "react/jsx-no-undef": 2,
            "react/jsx-sort-prop-types": 0,
            "react/jsx-sort-props": 0,
            "react/jsx-uses-react": 2,
            "react/jsx-uses-vars": 2,
            "react/no-did-update-set-state": 2,
            "react/no-did-mount-set-state": 2,

            "react/no-multi-comp": [2, {
                ignoreStateless: true,
            }],

            "react/no-unknown-property": 2,
            "react/prop-types": 2,
            "react/react-in-jsx-scope": 2,
            "react/self-closing-comp": 2,
            "react/sort-comp": 2,
            "react/jsx-wrap-multilines": 2,

            /**
             * React Hooks
             */
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",

            /**
             * Accessibility
             */
            "jsx-a11y/aria-props": 2,
            "jsx-a11y/heading-has-content": 2,

            "jsx-a11y/label-has-for": [1, {
                allowChildren: true,
            }],

            "jsx-a11y/mouse-events-have-key-events": 2,
            "jsx-a11y/role-has-required-aria-props": 2,
            "jsx-a11y/role-supports-aria-props": 2,
            "jsx-a11y/html-has-lang": 2,
            "jsx-a11y/click-events-have-key-events": 2,
            "jsx-a11y/no-onchange": 2,
            "jsx-a11y/img-has-alt": "off",
            "jsx-a11y/onclick-has-focus": "off",
            "jsx-a11y/href-no-hash": "off",
            "uqlibrary/no-uql-token": 2,

            /**
             * Style
             */
            "prettier/prettier": "error",

            "camelcase": [2, {
                properties: "never",
            }],

            "func-names": 1,
            "new-cap": [0, {
                newIsCap: true,
            }],

            "no-nested-ternary": 2,
            "no-object-constructor": 2,
            "no-underscore-dangle": 0,
            "one-var": [2, "never"],

            "@stylistic/brace-style": [2, "1tbs", {
                allowSingleLine: true,
            }],

            "@stylistic/block-spacing": [2, "always"],
            "@stylistic/comma-dangle": [2, "always-multiline"],
            "@stylistic/comma-spacing": [2, {
                before: false,
                after: true,
            }],

            "@stylistic/comma-style": [2, "last"],
            "@stylistic/eol-last": 2,
            "@stylistic/function-call-spacing": 2,
            "@stylistic/key-spacing": [2, {
                beforeColon: false,
                afterColon: true,
            }],

            "@stylistic/max-len": [2, {
                code: 120,
                ignoreRegExpLiterals: true,
                ignoreTemplateLiterals: true,
                ignoreUrls: true,
                ignoreStrings: true,
            }],

            "@stylistic/newline-per-chained-call": [2, {
                ignoreChainWithDepth: 2,
            }],

            "@stylistic/no-extra-parens": [2, "functions"],
            "@stylistic/no-multiple-empty-lines": [2, {
                max: 2,
            }],

            "@stylistic/no-trailing-spaces": 2,
            "@stylistic/object-curly-spacing": [2, "always"],

            "@stylistic/operator-linebreak": [2, "after", {
                overrides: {
                    "?": "before",
                    ":": "before",
                },
            }],

            "@stylistic/padded-blocks": [2, "never"],
            "@stylistic/quotes": [2, "single", "avoid-escape"],

            "@stylistic/semi": [2, "always"],
            "@stylistic/semi-spacing": [2, {
                before: false,
                after: true,
            }],

            "@stylistic/space-before-blocks": 2,
            "@stylistic/space-before-function-paren": [2, {
                named: "never",
                asyncArrow: "always",
            }],

            "@stylistic/spaced-comment": [2, "always", {
                exceptions: ["-", "+"],
                markers: ["=", "!"],
            }],

            "@stylistic/space-infix-ops": 2,
        },
    },
    ...tseslint.config({
        files: ["**/*.ts", "**/*.tsx"],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
        ]
    }),
    eslintPluginPrettierRecommended
]);