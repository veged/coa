var stream = require('stream'),
    spawn = require('child_process').spawn,
    fs = require('fs'),

    assert = require('chai').assert,
    COA = require('..');

describe('Cmd', function() {

    describe('Repl', function() {

        it('should makes working repl cmd', function (done) {
            // it's a long process
            this.timeout(500);

            spawnFunctionAsProgram(function () {
                var COA = require('..');

                var cmd = COA.Cmd()
                    .name('coa')
                    .repl({ prompt: '! ' })
                    .cmd()
                        .name('test')
                        .arg()
                            .name('arg1')
                            .end()
                        .act(function (opts, args) {
                            console.log(args.arg1);
                        })
                        .end()
                    .run();
            },
            function (err, cmd) {
                cmd.stdout.on('data', function (data) {
                    if (String(data).indexOf('yolo-swag') !== -1) {
                        cmd.kill();
                    }
                });
                cmd.stderr.on('data', function (data) {
                    done(data);
                });

                cmd.on('close', function () {
                    done();
                });

                cmd.stdin.write('test yolo-swag\n');
            });
        });

    });

});

// repl testings
function fnBody(func) {
    var str = func.toString();
    var out = str.slice(
        str.indexOf('{') + 1,
        str.lastIndexOf('}')
    );

    // strip trailing spaces and tabs
    out = out.replace(/^\n*|[ \t]*$/g, '');

    // strip preceding indentation
    var blockIndent = 0;
    out.match(/^([ \t]*)/gm).map(function(v) {
        if (!blockIndent || (v.length > 0 && v.length < blockIndent)) {
            blockIndent = v.length;
        }
    });

    // rebuild block without inner indent
    out = !blockIndent ? out : out.split('\n').map(function(v) {
        return v.substr(blockIndent);
    }).join('\n');

    return out;
}

function spawnFunctionAsProgram (fn, cb) {
    var body = fnBody(fn);
    var filename = './tmp/testing-coa-program.js';

    fs.mkdir('./tmp', function () {
        fs.unlink(filename, function () {
            fs.writeFile(filename, body, function (err) {
                if (err) cb(err);
                cb(null, spawn('/usr/bin/env', ['node', filename]));
            });
        });
    });
}
