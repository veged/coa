'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const shell = require('..').shell;

describe('shell', function() {

    describe('escape()', function() {

        var escape = shell.escape;

        it('Should wrap values with spaces in double quotes', function() {
            assert.strictEqual(escape('asd abc'), '"asd abc"');
        });

        it('Should escape double quote "', function() {
            assert.strictEqual(escape('"asd'), '\\"asd');
        });

        it("Should escape single quote '", function() {
            assert.strictEqual(escape("'asd"), "\\'asd");
        });

        it('Should escape backslash \\', function() {
            assert.strictEqual(escape('\\asd'), '\\\\asd');
        });

        it('Should escape dollar $', function() {
            assert.strictEqual(escape('$asd'), '\\$asd');
        });

        it('Should escape backtick `', function() {
            assert.strictEqual(escape('`asd'), '\\`asd');
        });

    });

    describe('unescape()', function() {

        var unescape = shell.unescape;

        it('Should strip double quotes at the both ends', function() {
            assert.strictEqual(unescape('"asd"'), 'asd');
        });

        it('Should not strip escaped double quotes at the both ends', function() {
            assert.strictEqual(unescape('\\"asd\\"'), '"asd"');
        });

    });

});
