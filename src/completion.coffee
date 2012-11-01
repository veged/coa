###*
Most of the code adopted from the npm package shell completion code.
See https://github.com/isaacs/npm/blob/master/lib/completion.js
###

Q = require 'q'
escape = require('./shell').escape
unescape = require('./shell').unescape

module.exports = ->
    @title('Shell completion')
        .helpful()
        .arg()
            .name('raw')
            .title('Completion words')
            .arr()
            .end()
        .act (opts, args) ->
            if process.platform == 'win32'
                e = new Error 'shell completion not supported on windows'
                e.code = 'ENOTSUP'
                e.errno = require('constants').ENOTSUP
                return @reject(e)

            # if the COMP_* isn't in the env, then just dump the script
            if !process.env.COMP_CWORD? or !process.env.COMP_LINE? or !process.env.COMP_POINT?
                return dumpScript(@_cmd._name)

            console.error '---------'
            console.error 'COMP_LINE:  %s', process.env.COMP_LINE
            console.error 'COMP_CWORD: %s', process.env.COMP_CWORD
            console.error 'COMP_POINT: %s', process.env.COMP_POINT
            console.error 'args: %j', args.raw

            # completion opts
            opts = getOpts args.raw

            # cmd
            { cmd, argv } = @_cmd._parseCmd opts.partialWords
            Q.when complete(cmd, opts), (compls) ->
                console.log compls.map(escape).join('\n')


dumpScript = (name) ->
    fs = require 'fs'
    path = require 'path'
    defer = Q.defer()

    fs.readFile path.resolve(__dirname, 'completion.sh'), 'utf8', (err, d) ->
        if err then return defer.reject err
        d = d.replace(/{{cmd}}/g, path.basename name).replace(/^\#\!.*?\n/, '')

        onError = (err) ->
            # Darwin is a real dick sometimes.
            #
            # This is necessary because the "source" or "." program in
            # bash on OS X closes its file argument before reading
            # from it, meaning that you get exactly 1 write, which will
            # work most of the time, and will always raise an EPIPE.
            #
            # Really, one should not be tossing away EPIPE errors, or any
            # errors, so casually. But, without this, `. <(cmd completion)`
            # can never ever work on OS X.
            if err.errno == require('constants').EPIPE
                process.stdout.removeListener 'error', onError
                defer.resolve()
            else
                defer.reject(err)

        process.stdout.on 'error', onError
        process.stdout.write d, -> defer.resolve()

    defer.promise


getOpts = (argv) ->
    # get the partial line and partial word, if the point isn't at the end
    # ie, tabbing at: cmd foo b|ar
    line = process.env.COMP_LINE
    w = +process.env.COMP_CWORD
    point = +process.env.COMP_POINT
    words = argv.map unescape
    word = words[w]
    partialLine = line.substr 0, point
    partialWords = words.slice 0, w

    # figure out where in that last word the point is
    partialWord = argv[w] or ''
    i = partialWord.length
    while partialWord.substr(0, i) isnt partialLine.substr(-1 * i) and i > 0
        i--
    partialWord = unescape partialWord.substr 0, i
    if partialWord then partialWords.push partialWord

    {
        line: line
        w: w
        point: point
        words: words
        word: word
        partialLine: partialLine
        partialWords: partialWords
        partialWord: partialWord
    }


isOpt = (p) ->
    p.indexOf('-') is 0

findOpt = (parts) ->
    for p in parts
        if isOpt(p) then return true
    return false

complete = (cmd, opts) ->
    compls = []
    partial = opts.partialWord
    prev = opts.partialWords[opts.w - 1]
    isPartialOpt = isOpt(partial)
    isPrevOpt = isOpt(prev)
    hasOpts = findOpt(opts.partialWords)

    addCompls = (c) ->
        compls.push c

    filterCompls = (compls) ->
        (compls || []).filter (c) ->
            partial is '' or c.indexOf(partial) is 0

    completeCmd = (cmd) ->
        if not hasOpts
            filterCompls Object.keys(cmd._cmdsByName or [])
        else
            []

    completeOpt = (cmd) ->
        # TODO: don't complete on opts in case of unknown arg after commands
        # TODO: complete only on opts with arr() or not already used
        filterCompls Object.keys(cmd._optsByKey or [])

    completeOptValue = (opt, prefix='', p=partial) ->
        if opt._comp
            newOpts = Object.create(opts, { partialWord: { value: p } })
            Q.when opt._comp(newOpts), (o) ->
                filterCompls o.map (v) -> prefix + v
        else
            []

    completeCustom = (cmd) ->
        if cmd._comp
            Q.when cmd._comp(opts), filterCompls
        else
            []

    # partial is not --opt, -o and can be empty
    if not isPartialOpt

        # if previous is --opt, -o and is valid option
        if isPrevOpt and (opt = cmd._optsByKey[prev])
            if opt._flag

                # do not complete if prev opt is only()
                if not opt._only
                    # complete on opts
                    addCompls completeOpt(cmd)

                    # custom completion on cmd
                    completeCustom(cmd)
            else
                # complete on opts values
                addCompls completeOptValue(opt)
        else
            # complete on cmds and opts
            addCompls completeCmd(cmd)
            addCompls completeOpt(cmd)

            # custom completion on cmd
            completeCustom(cmd)

    # partial is --opt or -o
    else

        if not isPrevOpt || ((opt = cmd._optsByKey[prev]) and opt._flag)

            # complete on opt values: --opt=| case
            if m = partial.match /^(--\w[\w\-_]*)=(.*)$/
                optWord = m[1]
                if (opt = cmd._optsByKey[optWord]) and not opt._flag
                    addCompls completeOptValue(opt, optWord + '=', m[2])

            # do not complete if prev opt is only()
            else if not opt or not opt._only
                # complete on opts
                addCompls completeOpt(cmd)

    # TODO: complete on args values (context aware, custom completion?)

    # TODO: context aware custom completion on cmds, opts and args
    # (can depend on already entered values, especially options)

    return Q.all(compls)
        .then (all) ->
            compls = []
            for one in all
                compls = compls.concat(one)

            console.error 'partial: %s', partial
            console.error 'compls: %j', compls

            compls
