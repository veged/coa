Q = require 'q'
QFS = require 'q-fs'
PATH = require 'path'

exports.unescape = (w) ->
    w = if w.charAt(0) is '"'
        w.replace(/^"|([^\\])"$/g, '$1')
    else
        w.replace(/\\ /g, ' ')
    w.replace(/\\("|'|\$|`|\\)/g, '$1')

exports.escape = (w) ->
    w = w.replace(/(["'$`\\])/g,'\\$1')
    if w.match(/\s+/) then '"' + w + '"' else w

###*
Get path completion callback function that can be used
with Opt.comp() and Arg.comp() methods.
@returns {Function}  Path completion function.
###
exports.pathCompletion = ->
    (opts) ->
        partial = opts.partialWord
        parts = partial.split('/')
        last = parts.pop()
        completePath(partial, parts.join('/'), last)

###*
Complete path on filesystem.
@param {String} partial Partial path to complete.
@param {String} [prefix]  Prefix of path to complete.
@param {String} [last]  Last component of path to complete
@returns {Promise * String[]}  Completion result.
###
completePath = exports.completePath = (partial, prefix=partial, last) ->
    # TODO: use system-aware directory separator
    # TODO: resolve ~ into user home dir
    # TODO: ability to complete only on dirs
    Q.all(
        # TODO: use `from` param or process.cwd() if empty
        QFS.list(PATH.join(process.cwd(), prefix))

            .then (res) ->
                if last and last.match(/^\./)
                    ['.', '..'].concat(res)
                else
                    res

            .invoke 'filter', (f) ->
                not last or f.indexOf(last) is 0

            .invoke 'map', (f) ->
                if prefix
                    f = [prefix, f].join('/')

                QFS.stat(f)
                    .then (stat) ->
                        f + if stat.isDirectory() then '/' else ''
        )
        .then (res) ->
            if res.length == 1 and (d = res[0]) and d.match(/\/$/)
                completePath(d)
                    .then (res) ->
                        [d].concat(res)
            else
                res
