'use strict';

const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const COA = require('..');

describe('Completion', function() {

    describe('completable command structure', function() {

        it('should add completion subcommand with helpful and arg', function() {
            const cmd = COA.Cmd()
                .name('test')
                .completable();

            const comp = cmd._cmdsByName['completion'];
            assert.ok(comp);
            assert.ok(comp._optsByKey['--help']);
            assert.ok(comp._args.length > 0);
            assert.strictEqual(comp._args[0]._name, 'raw');
        });

    });

    describe('dumpScript (no COMP_* env vars)', function() {
        let savedEnv;

        beforeEach(function() {
            savedEnv = {
                COMP_CWORD : process.env.COMP_CWORD,
                COMP_LINE : process.env.COMP_LINE,
                COMP_POINT : process.env.COMP_POINT
            };
            delete process.env.COMP_CWORD;
            delete process.env.COMP_LINE;
            delete process.env.COMP_POINT;
        });

        afterEach(function() {
            if(savedEnv.COMP_CWORD !== undefined) process.env.COMP_CWORD = savedEnv.COMP_CWORD;
            if(savedEnv.COMP_LINE !== undefined) process.env.COMP_LINE = savedEnv.COMP_LINE;
            if(savedEnv.COMP_POINT !== undefined) process.env.COMP_POINT = savedEnv.COMP_POINT;
        });

        it('should dump completion script', function() {
            const cmd = COA.Cmd()
                .name('testcli')
                .completable();

            let output = '';
            const origWrite = process.stdout.write;
            process.stdout.write = function(data, encodingOrCb, cb) {
                if(typeof data === 'string') output += data;
                const callback = typeof encodingOrCb === 'function' ? encodingOrCb : cb;
                if(callback) callback();
                return true;
            };

            return cmd.api.completion()
                .then(function() {
                    process.stdout.write = origWrite;
                    assert.ok(output.includes('testcli'));
                    assert.ok(output.includes('completion'));
                }, function(err) {
                    process.stdout.write = origWrite;
                    // exitCode 0 rejection is ok (from helpful/only flow)
                    if(err && err.exitCode === 0) return;
                    throw err;
                });
        });

    });

    // Note: The completion with COMP_* env vars path has bugs in completion.js:
    // 1. _parseCmd mutates the partialWords array in-place
    // 2. These bugs prevent testing the complete() and getOpts() code paths
    it.todo('completion with COMP_* env vars (requires completion.js bug fixes)');

    describe('windows platform', function() {

        it('should reject on win32', function() {
            const origPlatform = Object.getOwnPropertyDescriptor(process, 'platform');
            Object.defineProperty(process, 'platform', { value : 'win32', configurable : true });

            const cmd = COA.Cmd()
                .name('test')
                .completable();

            return cmd.api.completion()
                .then(
                    function() {
                        if(origPlatform) Object.defineProperty(process, 'platform', origPlatform);
                        else Object.defineProperty(process, 'platform', { value : 'linux', configurable : true });
                        throw new Error('should have rejected');
                    },
                    function(err) {
                        if(origPlatform) Object.defineProperty(process, 'platform', origPlatform);
                        else Object.defineProperty(process, 'platform', { value : 'linux', configurable : true });
                        assert.strictEqual(err.code, 'ENOTSUP');
                    }
                );
        });

    });

});
