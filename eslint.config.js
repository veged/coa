'use strict';

const js = require('@eslint/js');

module.exports = [
    js.configs.recommended,
    {
        languageOptions : {
            ecmaVersion : 2024,
            sourceType : 'commonjs',
            globals : {
                require : 'readonly',
                module : 'readonly',
                exports : 'readonly',
                __dirname : 'readonly',
                __filename : 'readonly',
                process : 'readonly',
                console : 'readonly',
                Buffer : 'readonly',
                setTimeout : 'readonly',
                setInterval : 'readonly',
                clearTimeout : 'readonly',
                clearInterval : 'readonly'
            }
        },
        rules : {
            'curly' : 'off',
            'no-cond-assign' : 'off',

            'semi' : 'error',
            'no-mixed-spaces-and-tabs' : 'error',
            'max-len' : ['error', { 'code' : 120 }],
            'eol-last' : 'error',
            'key-spacing' : ['error', {
                'beforeColon' : true,
                'afterColon' : true,
                'mode' : 'strict'
            }],
            'object-curly-spacing' : ['error', 'always'],
            'keyword-spacing' : ['error', {
                'before' : true,
                'after' : true,
                'overrides' : {
                    'if' : { 'after' : false },
                    'for' : { 'after' : false },
                    'while' : { 'after' : false },
                    'switch' : { 'after' : false }
                }
            }],
            'array-bracket-spacing' : ['error', 'never'],
            'arrow-parens' : ['error', 'as-needed'],

            'space-before-blocks' : ['error', 'always'],
            'padded-blocks' : ['error', 'never'],
            'quotes' : ['error', 'single', { 'avoidEscape' : true }],
            'camelcase' : ['error', { 'properties' : 'never' }],
            'no-trailing-spaces' : 'error',
            'comma-dangle' : ['error', 'never'],
            'no-prototype-builtins' : 'error'
        }
    },
    {
        files : ['test/**/*.js'],
        rules : {
            'padded-blocks' : 'off'
        }
    },
    {
        ignores : [
            '.idea/',
            '*.iml',
            'node_modules/',
            'coverage/'
        ]
    }
];
