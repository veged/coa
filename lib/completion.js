'use strict';

const { constants : { errno : errnoConstants } } = require('os');
const { readFile } = require('fs/promises');
const path = require('path');

const shell = require('./shell');
const escape = shell.escape;
const unescape = shell.unescape;

/**
 * Most of the code adopted from the npm package shell completion code.
 * See https://github.com/isaacs/npm/blob/master/lib/completion.js
 *
 * @returns {COA.CoaObject}
 */
module.exports = function completion() {
    return this
        .title('Shell completion')
        .helpful()
        .arg()
            .name('raw')
            .title('Completion words')
            .arr()
            .end()
        .act((opts, args) => {
            if(process.platform === 'win32') {
                const e = new Error('shell completion not supported on windows');
                e.code = 'ENOTSUP';
                e.errno = errnoConstants.ENOTSUP;
                return this.reject(e);
            }

            // if the COMP_* isn't in the env, then just dump the script
            if((process.env.COMP_CWORD == null)
                || (process.env.COMP_LINE == null)
                || (process.env.COMP_POINT == null)) {
                return dumpScript(this._cmd._name);
            }

            console.error('COMP_LINE:  %s', process.env.COMP_LINE);
            console.error('COMP_CWORD: %s', process.env.COMP_CWORD);
            console.error('COMP_POINT: %s', process.env.COMP_POINT);
            console.error('args: %j', args.raw);

            // completion opts
            opts = getOpts(args.raw);

            // cmd
            const parsed = this._cmd._parseCmd(opts.partialWords);
            return Promise.resolve(complete(parsed.cmd, opts)).then(compls => {
                console.error('filtered: %j', compls);
                return console.log(compls.map(escape).join('\n'));
            });
        });
};

async function dumpScript(name) {
    let d = await readFile(path.resolve(__dirname, 'completion.sh'), 'utf8');
    d = d.replace(/{{cmd}}/g, path.basename(name)).replace(/^#!.*?\n/, '');

    return new Promise((resolve, reject) => {
        process.stdout.on('error', onError);
        process.stdout.write(d, () => resolve());

        function onError(err) {
            if(err.errno !== errnoConstants.EPIPE) return reject(err);
            process.stdout.removeListener('error', onError);
            return resolve();
        }
    });
}

function getOpts(argv) {
    const line = process.env.COMP_LINE;
    const w = +process.env.COMP_CWORD;
    const point = +process.env.COMP_POINT;
    const words = argv.map(unescape);
    const word = words[w];
    const partialLine = line.slice(0, point);
    const partialWords = words.slice(0, w);

    let partialWord = argv[w] || '';
    let i = partialWord.length;
    while(partialWord.slice(0, i) !== partialLine.slice(-i) && i > 0) i--;

    partialWord = unescape(partialWord.slice(0, i));
    partialWord && partialWords.push(partialWord);

    return {
        line,
        w,
        point,
        words,
        word,
        partialLine,
        partialWords,
        partialWord
    };
}

function complete(cmd, opts) {
    let optWord, optPrefix,
        compls = [];

    // Complete on cmds
    if(opts.partialWord.indexOf('-'))
        compls = Object.keys(cmd._cmdsByName);
    else {
        // complete on opt values: --opt=| case
        const m = opts.partialWord.match(/^(--\w[\w-_]*)=(.*)$/);
        if(m) {
            optWord = m[1];
            optPrefix = optWord + '=';
        } else
            compls = Object.keys(cmd._optsByKey);
    }

    // complete on opt values: next arg case
    opts.partialWords[opts.w - 1].indexOf('-') || (optWord = opts.partialWords[opts.w - 1]);

    // complete on opt values: completion
    let opt;
    optWord
        && (opt = cmd._optsByKey[optWord])
        && !opt._flag
        && opt._comp
        && (compls = Promise.all([compls, Promise.resolve(opt._comp(opts))])
            .then(([c, o]) => c.concat(o.map(v => (optPrefix || '') + v))));

    // custom completion on cmds
    cmd._comp && (compls = Promise.all([compls, Promise.resolve(cmd._comp(opts))])
        .then(([c, o]) => c.concat(o)));

    return Promise.resolve(compls).then(completions => {
        console.error('partialWord: %s', opts.partialWord);
        console.error('compls: %j', completions);
        return completions.filter(c => c.indexOf(opts.partialWord) === 0);
    });
}
