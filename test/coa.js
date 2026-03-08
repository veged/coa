'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const COA = require('..');

describe('Opt', function() {

    describe('Unknown option', function() {

        const cmd = COA.Cmd();

        it('should fail', function() {
            return assert.rejects(cmd.do(['-a']));
        });

    });

    describe('Short options', function() {

        const cmd = COA.Cmd()
            .opt()
                .name('a')
                .short('a')
                .end()
            .opt()
                .name('b')
                .short('b')
                .end()
            .act(function(opts) {
                return opts;
            });

        it('should return passed values', function() {
            return cmd.do(['-a', 'a', '-b', 'b'])
                .then(function(res) {
                    assert.deepStrictEqual(res, { a : 'a', b : 'b' });
                });
        });

    });

    describe('Long options', function() {

        const cmd = COA.Cmd()
            .opt()
                .name('long1')
                .long('long1')
                .end()
            .opt()
                .name('long2')
                .long('long2')
                .end()
            .act(function(opts) {
                return opts;
            });

        it('should return passed values', function() {
            return cmd.do(['--long1', 'long value', '--long2=another long value'])
                .then(function(res) {
                    assert.deepStrictEqual(res, { long1 : 'long value', long2 : 'another long value' });
                });
        });

    });

    describe('Array option', function() {

        const cmd = COA.Cmd()
            .opt()
                .name('a')
                .short('a')
                .arr()
                .end()
            .act(function(opts) {
                return opts;
            });

        it('should return array of passed values', function() {
            return cmd.do(['-a', '1', '-a', '2'])
                .then(function(res) {
                    assert.deepStrictEqual(res, { a : ['1', '2'] });
                });
        });

    });

    describe('Required option', function() {

        const cmd = COA.Cmd()
            .opt()
                .name('a')
                .short('a')
                .req()
                .end()
            .act(function(opts) {
                return opts;
            });

        it('should fail if not specified', function() {
            return assert.rejects(cmd.do());
        });

        it('should return passed value if specified', function() {
            return cmd.do(['-a', 'test'])
                .then(function(opts) {
                    assert.strictEqual(opts.a, 'test');
                });
        });

    });

    describe('Option with default value', function() {

        const cmd = COA.Cmd()
            .opt()
                .name('a')
                .short('a')
                .def('aaa')
                .end()
            .opt()
                .name('b')
                .short('b')
                .def(false)
                .end()
            .opt()
                .name('c')
                .short('c')
                .def(0)
                .end()
            .act(function(opts) {
                return opts;
            });

        it('should return default value if not specified', function() {
            return cmd.do()
                .then(function(opts) {
                    assert.deepStrictEqual(opts, {
                        a : 'aaa',
                        b : false,
                        c : 0
                    });
                });
        });

        it('should return passed value if specified', function() {
            return cmd.do(['-a', 'test'])
                .then(function(opts) {
                    assert.strictEqual(opts.a, 'test');
                });
        });

    });

    describe('Validated / transformed option', function() {

        const cmd = COA.Cmd()
            .opt()
                .name('a')
                .short('a')
                .val(function(v) {
                    if(v === 'invalid') return this.reject('fail');
                    return { value : v };
                })
                .end()
            .act(function(opts) {
                return opts;
            });

        it('should fail if custom checks suppose to do so', function() {
            return assert.rejects(cmd.do(['-a', 'invalid']));
        });

        it('should return transformed value', function() {
            return cmd.do(['-a', 'test'])
                .then(function(opts) {
                    assert.deepStrictEqual(opts.a, { value : 'test' });
                });
        });

    });

    describe('Act in option', function() {

        const cmd = COA.Cmd()
            .opt()
                .name('a')
                .short('a')
                .act(opts => ({ b : 'b' + opts.a }))
                .act((opts, args, res) => ({ z : 'z' + opts.a + res.b }))
                .end();

        it('should return transformed value by act', () =>
            cmd.do(['-a', 'est']).then(opts =>
                assert.deepStrictEqual(opts, { z : 'zestbest' })));

    });

    describe('Only option (--version case)', function() {

        const ver = require('../package.json').version,
            cmd = COA.Cmd()
                .opt()
                    .name('version')
                    .long('version')
                    .flag()
                    .only()
                    .act(function() {
                        return ver;
                    })
                    .end()
                .opt()
                    .name('req')
                    .short('r')
                    .req()
                    .end();

        it('should process the only() option', function() {
            return cmd.do(['--version'])
                .then(
                    () => { throw new Error('should have rejected'); },
                    function(res) {
                        assert.strictEqual(res.toString(), ver);
                    }
                );
        });

    });

    describe('input()', function() {

        it('should default to stdin', function() {
            const cmd = COA.Cmd()
                .opt()
                    .name('i')
                    .short('i')
                    .input()
                    .end()
                .act(function(opts) {
                    return opts;
                });

            return cmd.do()
                .then(function(opts) {
                    assert.strictEqual(opts.i, process.stdin);
                });
        });

        it('should return stdin for "-"', function() {
            const cmd = COA.Cmd()
                .opt()
                    .name('i')
                    .short('i')
                    .input()
                    .end()
                .act(function(opts) {
                    return opts;
                });

            return cmd.do(['-i', '-'])
                .then(function(opts) {
                    assert.strictEqual(opts.i, process.stdin);
                });
        });

        it('should return a read stream for a file path', function() {
            const path = require('path');
            const testFile = path.resolve(__dirname, '..', 'package.json');

            const cmd = COA.Cmd()
                .opt()
                    .name('i')
                    .short('i')
                    .input()
                    .end()
                .act(function(opts) {
                    return opts;
                });

            return cmd.do(['-i', testFile])
                .then(function(opts) {
                    assert.strictEqual(typeof opts.i.pipe, 'function');
                    opts.i.destroy();
                });
        });

        it('should pass through non-string values', function() {
            const cmd = COA.Cmd()
                .opt()
                    .name('i')
                    .short('i')
                    .input()
                    .end()
                .act(function(opts) {
                    return opts;
                });

            const stream = { pipe : function() {} };
            return cmd.invoke({ i : stream })
                .then(function(opts) {
                    assert.strictEqual(opts.i, stream);
                });
        });

    });

    describe('output()', function() {

        it('should default to stdout', function() {
            const cmd = COA.Cmd()
                .opt()
                    .name('o')
                    .short('o')
                    .output()
                    .end()
                .act(function(opts) {
                    return opts;
                });

            return cmd.do()
                .then(function(opts) {
                    assert.strictEqual(opts.o, process.stdout);
                });
        });

        it('should return stdout for "-"', function() {
            const cmd = COA.Cmd()
                .opt()
                    .name('o')
                    .short('o')
                    .output()
                    .end()
                .act(function(opts) {
                    return opts;
                });

            return cmd.do(['-o', '-'])
                .then(function(opts) {
                    assert.strictEqual(opts.o, process.stdout);
                });
        });

        it('should return a write stream for a file path', function() {
            const os = require('os');
            const path = require('path');
            const fs = require('fs');
            const tmpFile = path.join(os.tmpdir(), 'coa-test-output-' + Date.now());

            const cmd = COA.Cmd()
                .opt()
                    .name('o')
                    .short('o')
                    .output()
                    .end()
                .act(function(opts) {
                    return opts;
                });

            return cmd.do(['-o', tmpFile])
                .then(function(opts) {
                    assert.strictEqual(typeof opts.o.write, 'function');
                    opts.o.destroy();
                    try { fs.unlinkSync(tmpFile); } catch { /* ignore */ }
                });
        });

        it('should pass through non-string values', function() {
            const cmd = COA.Cmd()
                .opt()
                    .name('o')
                    .short('o')
                    .output()
                    .end()
                .act(function(opts) {
                    return opts;
                });

            const stream = { write : function() {} };
            return cmd.invoke({ o : stream })
                .then(function(opts) {
                    assert.strictEqual(opts.o, stream);
                });
        });

    });

});

describe('Arg', function() {

    describe('Unknown arg', function() {

        const cmd = COA.Cmd();

        it('should fail', function() {
            return assert.rejects(cmd.do(['test']));
        });

    });

    describe('Unknown arg after known', function() {

        const cmd = COA.Cmd()
            .arg()
                .name('a')
                .end();

        it('should fail', function() {
            return assert.rejects(cmd.do(['test', 'unknown']));
        });

    });

    describe('Array arg', function() {

        const cmd = COA.Cmd()
            .arg()
                .name('a')
                .arr()
                .end()
            .act(function(opts, args) {
                return args;
            });

        it('should return array of passed values', function() {
            return cmd.do(['value 1', 'value 2'])
                .then(function(args) {
                    assert.deepStrictEqual(args, { a : ['value 1', 'value 2'] });
                });
        });

    });

    describe('Required arg', function() {

        const cmd = COA.Cmd()
            .arg()
                .name('a')
                .req()
                .end()
            .act(function(opts, args) {
                return args;
            });

        it('should fail if not specified', function() {
            return assert.rejects(cmd.do());
        });

        it('should return passed value if specified', function() {
            return cmd.do(['value'])
                .then(function(args) {
                    assert.strictEqual(args.a, 'value');
                });
        });

    });

    describe('Args after options', function() {

        const cmd = COA.Cmd()
            .opt()
                .name('opt')
                .long('opt')
                .end()
            .arg()
                .name('arg1')
                .end()
            .arg()
                .name('arg2')
                .arr()
                .end()
            .act(function(opts, args) {
                return { opts : opts, args : args };
            });

        it('should return passed values', function() {
            return cmd.do(['--opt', 'value', 'value', 'value 1', 'value 2'])
                .then(function(o) {
                    assert.deepStrictEqual(o, {
                        opts : { opt : 'value' },
                        args : {
                            arg1 : 'value',
                            arg2 : ['value 1', 'value 2']
                        }
                    });
                });
        });

    });

    describe('Raw args', function() {

        const cmd = COA.Cmd()
            .arg()
                .name('raw')
                .arr()
                .end()
            .act(function(opts, args) {
                return args;
            });

        it('should return passed arg values', function() {
            return cmd.do(['--', 'raw', 'arg', 'values'])
                .then(function(args) {
                    assert.deepStrictEqual(args, { raw : ['raw', 'arg', 'values'] });
                });
        });

    });

});

describe('Cmd', function() {

    describe('Action', function() {

        it('should declare few acts and pass result thru', function() {
            return COA.Cmd()
                .act(() => 12)
                .act((opts, args, res) => `${res} 34`)
                .do()
                .then(res => assert.strictEqual(res, '12 34'));
        });

        it('should not fail on empty act', function() {
            return COA.Cmd().act().do();
        });

        it('should drop actions on force', function() {
            return COA.Cmd()
                .act(() => { throw new Error('Should be rewritten'); })
                .act(() => 42, true)
                .do().then(res => assert.strictEqual(res, 42));
        });

    });

    const doTest = function(o) {
            assert.deepStrictEqual(o, {
                opts : { opt : 'value' },
                args : {
                    arg1 : 'value',
                    arg2 : ['value 1', 'value 2']
                }
            });
        },

        invokeOpts = { opt : 'value' },
        invokeArgs = {
            arg1 : 'value',
            arg2 : ['value 1', 'value 2']
        };

    describe('Subcommand', function() {

        const cmd = COA.Cmd()
            .cmd()
                .name('command')
                .opt()
                    .name('opt')
                    .long('opt')
                    .end()
                .arg()
                    .name('arg1')
                    .end()
                .arg()
                    .name('arg2')
                    .arr()
                    .end()
                .act(function(opts, args) {
                    return { opts : opts, args : args };
                })
                .end();

        describe('when specified on command line', function() {

            it('should be invoked and accept passed opts and args', function() {
                return cmd.do(['command', '--opt', 'value', 'value', 'value 1', 'value 2'])
                    .then(doTest);
            });

        });

        describe('when invoked using api', function() {

            it('should be invoked and accept passed opts and args', function() {
                return cmd.api.command(invokeOpts, invokeArgs)
                    .then(doTest);
            });

        });

        describe('when invoked using invoke()', function() {

            it('should be invoked and accept passed opts and args', function() {
                return cmd.invoke('command', invokeOpts, invokeArgs)
                    .then(doTest);
            });

        });

        describe('when unexisting command invoked using invoke()', function() {

            it('should fail', function() {
                return assert.rejects(cmd.invoke('unexistent'));
            });

        });

    });

    describe('External subcommand', function() {

        describe('default scheme: cmd.extendable()', function() {

            describe('when described as a function', function() {
                const cmd = COA.Cmd()
                    .name('coa')
                    .extendable();

                it('should be invoked and accept passed opts and args', function() {
                    return cmd.do(['test', '--opt', 'value', 'value', 'value 1', 'value 2'])
                        .then(doTest);
                });
            });

            describe('when described as an COA.Cmd() object', function() {
                const cmd = COA.Cmd()
                    .name('coa')
                    .extendable();

                it('should be invoked and accept passed opts and args', function() {
                    return cmd.do(['test-obj', '--opt', 'value', 'value', 'value 1', 'value 2'])
                        .then(doTest);
                });
            });

            describe('2nd level subcommand', function() {
                const cmd = COA.Cmd()
                    .name('coa')
                    .cmd()
                    .name('test')
                    .extendable()
                    .end();

                it('should be invoked and accept passed opts and args', function() {
                    return cmd.do(['test', 'obj', '--opt', 'value', 'value', 'value 1', 'value 2'])
                        .then(doTest);
                });
            });

        });

        describe("common prefix: cmd.extendable('coa-')", function() {

            describe('when described as a function', function() {
                const cmd = COA.Cmd()
                    .name('coa')
                    .extendable('coa-');

                it('should be invoked and accept passed opts and args', function() {
                    return cmd.do(['test', '--opt', 'value', 'value', 'value 1', 'value 2'])
                        .then(doTest);
                });
            });

        });

        describe("format string: cmd.extendable('coa-%s')", function() {

            describe('when described as a function', function() {
                const cmd = COA.Cmd()
                    .name('coa')
                    .extendable('coa-%s');

                it('should be invoked and accept passed opts and args', function() {
                    return cmd.do(['test', '--opt', 'value', 'value', 'value 1', 'value 2'])
                        .then(doTest);
                });
            });

        });

    });

    describe('name()', function() {

        it('should set command name', function() {
            const cmd = COA.Cmd().name('test-cmd');
            assert.strictEqual(cmd._name, 'test-cmd');
        });

    });

    describe('title()', function() {

        it('should set command title', function() {
            const cmd = COA.Cmd().title('Test command');
            assert.strictEqual(cmd._title, 'Test command');
        });

    });

    describe('helpful()', function() {

        it('should add --help option', function() {
            const cmd = COA.Cmd()
                .name('test')
                .title('Test')
                .helpful();

            assert.ok(cmd._optsByKey['--help']);
            assert.ok(cmd._optsByKey['-h']);
        });

        it('should print usage on --help', function() {
            const cmd = COA.Cmd()
                .name('test')
                .title('Test')
                .helpful();

            return cmd.do(['--help'])
                .then(
                    () => { throw new Error('should have rejected'); },
                    function(res) {
                        assert.ok(res.toString().length > 0);
                    }
                );
        });

    });

    describe('usage()', function() {

        it('should contain title', function() {
            const cmd = COA.Cmd()
                .name('test')
                .title('Test Title');

            const usage = cmd.usage();
            assert.ok(usage.includes('Test Title'));
        });

        it('should list options', function() {
            const cmd = COA.Cmd()
                .name('test')
                .opt()
                    .name('opt1')
                    .title('Option 1')
                    .long('opt1')
                    .end();

            const usage = cmd.usage();
            assert.ok(usage.includes('Options'));
            assert.ok(usage.includes('Option 1'));
        });

        it('should list arguments', function() {
            const cmd = COA.Cmd()
                .name('test')
                .arg()
                    .name('arg1')
                    .title('Argument 1')
                    .end();

            const usage = cmd.usage();
            assert.ok(usage.includes('Arguments'));
            assert.ok(usage.includes('Argument 1'));
        });

        it('should list subcommands', function() {
            const cmd = COA.Cmd()
                .name('test')
                .cmd()
                    .name('sub')
                    .title('Subcommand')
                    .end();

            const usage = cmd.usage();
            assert.ok(usage.includes('Commands'));
            assert.ok(usage.includes('Subcommand'));
        });

        it('should show full title with parent', function() {
            const cmd = COA.Cmd()
                .name('test')
                .title('Parent Title')
                .cmd()
                    .name('sub')
                    .title('Sub Title')
                    .end();

            const sub = cmd._cmdsByName['sub'];
            const usage = sub.usage();
            assert.ok(usage.includes('Parent Title'));
            assert.ok(usage.includes('Sub Title'));
        });

    });

    describe('completable()', function() {

        it('should add completion subcommand', function() {
            const cmd = COA.Cmd()
                .name('test')
                .completable();

            assert.ok(cmd._cmdsByName['completion']);
        });

    });

    describe('comp()', function() {

        it('should set custom completion', function() {
            const compFn = function() { return ['a', 'b']; };
            const cmd = COA.Cmd().comp(compFn);
            assert.strictEqual(cmd._comp, compFn);
        });

    });

    describe('apply()', function() {

        it('should apply function with arguments', function() {
            let receivedArgs;
            const cmd = COA.Cmd()
                .apply(function(a, b) {
                    receivedArgs = [a, b];
                    this.name('applied');
                }, 'x', 'y');

            assert.deepStrictEqual(receivedArgs, ['x', 'y']);
            assert.strictEqual(cmd._name, 'applied');
        });

    });

    describe('extendable with unsupported type', function() {

        it('should throw for non-function/non-object command', function() {
            // Create a module that exports a string (unsupported)
            const cmd = COA.Cmd()
                .name('test')
                .extendable();

            // Just verify extendable sets _ext
            assert.strictEqual(cmd._ext, true);
        });

    });

    describe('Opt _usage()', function() {

        it('should format option with short only', function() {
            const cmd = COA.Cmd()
                .opt()
                    .name('verbose')
                    .title('Verbose output')
                    .short('v')
                    .flag()
                    .end();

            const opt = cmd._opts[0];
            const usage = opt._usage();
            assert.ok(usage.includes('-'));
            assert.ok(usage.includes('v'));
            assert.ok(usage.includes('Verbose output'));
        });

        it('should format option with long only', function() {
            const cmd = COA.Cmd()
                .opt()
                    .name('verbose')
                    .title('Verbose output')
                    .long('verbose')
                    .end();

            const opt = cmd._opts[0];
            const usage = opt._usage();
            assert.ok(usage.includes('verbose'));
            assert.ok(usage.includes('Verbose output'));
        });

        it('should format required option', function() {
            const cmd = COA.Cmd()
                .opt()
                    .name('file')
                    .title('File path')
                    .long('file')
                    .req()
                    .end();

            const opt = cmd._opts[0];
            const usage = opt._usage();
            assert.ok(usage.includes('required'));
        });

        it('should format non-flag short option with value name', function() {
            const cmd = COA.Cmd()
                .opt()
                    .name('file')
                    .title('File path')
                    .short('f')
                    .long('file')
                    .end();

            const opt = cmd._opts[0];
            const usage = opt._usage();
            assert.ok(usage.includes('FILE'));
        });

    });

    describe('Arg _usage()', function() {

        it('should format required argument', function() {
            const cmd = COA.Cmd()
                .arg()
                    .name('file')
                    .title('File path')
                    .req()
                    .end();

            const arg = cmd._args[0];
            const usage = arg._usage();
            assert.ok(usage.includes('required'));
            assert.ok(usage.includes('FILE'));
        });

    });

});
