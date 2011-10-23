var vows = require('vows'),
    assert = require('assert'),
    shell = require('../lib/shell');

vows.describe('coa/shell').addBatch({

    'The shell module': {

        '`escape`': {

            topic: function() {
                return shell.escape;
            },

            'Should wrap values with spaces in double quotes': function(escape) {
                assert.equal(escape('asd abc'), '"asd abc"');
            },

            'Should escape double quote "': function(escape) {
                assert.equal(escape('"asd'), '\\"asd');
            },

            "Should escape single quote '": function(escape) {
                assert.equal(escape("'asd"), "\\'asd");
            },

            'Should escape backslash \\': function(escape) {
                assert.equal(escape('\\asd'), '\\\\asd');
            },

            'Should escape dollar $': function(escape) {
                assert.equal(escape('$asd'), '\\$asd');
            },

            'Should escape backtick `': function(escape) {
                assert.equal(escape('`asd'), '\\`asd');
            }

        },

        '`unescape`': {

            topic: function() {
                return shell.unescape;
            },

            'Should strip double quotes at the both ends': function(unescape) {
                assert.equal(unescape('"asd"'), 'asd');
            },

            'Should not strip escaped double quotes at the both ends': function(unescape) {
                assert.equal(unescape('\\"asd\\"'), '"asd"');
            }

        }

    }

}).export(module);
