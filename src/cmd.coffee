sys = require 'sys'
path = require 'path'
Color = require('./color').Color
Q = require('q')

#inspect = require('eyes').inspector { maxLength: 99999, stream: process.stderr }

###*
## Command
Top level entity. Commands may have options and arguments.
@namespace
@class Presents command
###
exports.Cmd = class Cmd

    ###*
    @constructs
    @param {COA.Cmd} [cmd] parent command
    ###
    constructor: (cmd) ->
        if this not instanceof Cmd
            return new Cmd cmd

        @_parent cmd

        @_cmds = []
        @_cmdsByName = {}

        @_opts = []
        @_optsByKey = {}

        @_args = []

    _parent: (cmd) ->
        if cmd then cmd._cmds.push @
        @_cmd = cmd or this
        @

    ###*
    Set a canonical command identifier to be used anywhere in the API.
    @param {String} _name command name
    @returns {COA.Cmd} this instance (for chainability)
    ###
    name: (@_name) -> @_cmd._cmdsByName[_name] = @

    ###*
    Set a long description for command to be used anywhere in text messages.
    @param {String} _title command title
    @returns {COA.Cmd} this instance (for chainability)
    ###
    title: (@_title) -> @

    ###*
    Create new or add existing subcommand for current command.
    @param {COA.Cmd} [cmd] existing command instance
    @returns {COA.Cmd} new subcommand instance
    ###
    cmd: (cmd) ->
        if cmd then cmd._parent @
        else new Cmd @

    ###*
    Create option for current command.
    @returns {COA.Opt} new option instance
    ###
    opt: -> new (require('./opt').Opt) @

    ###*
    Create argument for current command.
    @returns {COA.Opt} new argument instance
    ###
    arg: -> new (require('./arg').Arg) @

    ###*
    Add (or set) action for current command.
    @param {Function} act action function,
        invoked in the context of command instance
        and has the parameters:
            - {Object} opts parsed options
            - {Array} args parsed arguments
            - {Object} res actions result accumulator
        It can return rejected promise by Cmd.reject (in case of error)
        or any other value treated as result.
    @param {Boolean} [force=false] flag for set action instead add to existings
    @returns {COA.Cmd} this instance (for chainability)
    ###
    act: (act, force) ->
        return @ unless act

        if not force and @_act
            @_act.push act
        else
            @_act = [act]

        @

    ###*
    Apply function with arguments in context of command instance.
    @param {Function} fn
    @param {Array} args
    @returns {COA.Cmd} this instance (for chainability)
    ###
    apply: (fn, args...) ->
        fn.apply this, args
        @

    ###*
    Make command "helpful", i.e. add -h --help flags for print usage.
    @returns {COA.Cmd} this instance (for chainability)
    ###
    helpful: ->
        @opt()
            .name('help').title('Help')
            .short('h').long('help')
            .flag()
            .only()
            .act ->
                return @usage()
            .end()


    _exit: (msg, code) ->
        if msg then sys.error msg
        process.exit code or 0

    ###*
    Build full usage text for current command instance.
    @returns {String} usage text
    ###
    usage: ->
        res = []

        if @_title then res.push @_fullTitle()

        res.push('', 'Usage:')

        if @_cmds.length then res.push(['', '',
            Color('lred', @_fullName()),
            Color('lblue', 'COMMAND'),
            Color('lgreen', '[OPTIONS]'),
            Color('lpurple', '[ARGS]')].join ' ')

        if @_opts.length + @_args.length then res.push(['', '',
            Color('lred', @_fullName()),
            Color('lgreen', '[OPTIONS]'),
            Color('lpurple', '[ARGS]')].join ' ')

        res.push(
            @_usages(@_cmds, 'Commands'),
            @_usages(@_opts, 'Options'),
            @_usages(@_args, 'Arguments'))

        res.join '\n'

    _usage: ->
        Color('lblue', @_name) + ' : ' + @_title

    _usages: (os, title) ->
        unless os.length then return
        res = ['', title + ':']
        for o in os
            res.push '  ' + o._usage()
        res.join '\n'

    _fullTitle: ->
        (if @_cmd is this then '' else @_cmd._fullTitle() + '\n') + @_title

    _fullName: ->
        (if this._cmd is this then '' else @_cmd._fullName() + ' ') + path.basename(@_name)

    _ejectOpt: (opts, opt) ->
        if (pos = opts.indexOf(opt)) >= 0
            if opts[pos]._arr
                opts[pos]
            else
                opts.splice(pos, 1)[0]

    _parseArr: (argv, opts = {}, args = {}) ->
        nonParsedOpts = @_opts.concat()

        while i = argv.shift()
            # opt
            if not i.indexOf '-'

                nonParsedArgs or= @_args.concat()

                if m = i.match /^(--\w[\w-_]*)=(.*)$/
                    i = m[1]
                    argv.unshift m[2]

                if opt = @_ejectOpt nonParsedOpts, @_optsByKey[i]
                    opt._parse argv, opts
                else
                    return @reject "Unknown option: #{ i }"

            # cmd
            else if not nonParsedArgs and /^\w[\w-_]*$/.test i
                cmd = @_cmdsByName[i]
                if cmd
                    return cmd._parseArr argv, opts, args
                else
                    nonParsedArgs = @_args.concat()
                    argv.unshift i

            # arg
            else
                if arg = (nonParsedArgs or= @_args.concat()).shift()
                    if arg._arr then nonParsedArgs.unshift arg
                    arg._parse i, args
                else
                    return @reject "Unknown argument: #{ i }"

        nonParsedArgs or= @_args.concat()

        hitOnly = false
        for opt in @_opts
            if opt._only and opt._name of opts
                hitOnly = true

        if not hitOnly
            nonParsed = nonParsedOpts.concat nonParsedArgs
            while i = nonParsed.shift()
                if i._req and i._checkParsed opts, args
                    return @reject i._requiredText()
                if '_def' of i
                    i._saveVal opts, i._def

        { cmd: @, opts: opts, args: args }

    _do: (input, succ, err) ->
        defer = Q.defer()
        parsed = @_parseArr input
        cmd = parsed.cmd or @
        cmd._act?.reduce(
            (res, act) =>
                res.then (params) =>
                    actRes = act.call(
                        cmd
                        params.opts
                        params.args
                        params.res)

                    if Q.isPromise actRes
                        actRes
                    else
                        params.res ?= actRes
                        params
            defer.promise
        )
        .fail((res) => err.call cmd, res)
        .then((res) => succ.call cmd, res.res)

        defer.resolve parsed

    ###*
    Parse arguments from simple format like NodeJS process.argv
    and run ahead current program, i.e. call process.exit when all actions done.
    @param {Array} argv
    @returns {COA.Cmd} this instance (for chainability)
    ###
    run: (argv = process.argv.slice(2)) ->
        @_do(
            argv
            (res) -> @_exit res.toString(), res.exitCode ? 0
            (res) -> @_exit res.toString(), res.exitCode ? 1
        )
        @

    ###*
    Return reject of actions results promise with error code.
    Use in .act() for return with error.
    @param {Object} reject reason
        You can customize toString() method and exitCode property
        of reason object.
    @returns {Q.promise} rejected promise
    ###
    reject: (reason) -> Q.reject(reason)

    ###*
    Finish chain for current subcommand and return parent command instance.
    @returns {COA.Cmd} parent command
    ###
    end: -> @_cmd
