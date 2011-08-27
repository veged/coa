sys = require 'sys'
path = require 'path'
Color = require('./color').Color

inspect = require('eyes').inspector { maxLength: 99999, stream: process.stderr }

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

        if cmd then cmd._cmds.push @
        @_cmd = cmd or this

        @_cmds = []
        @_cmdsByName = {}

        @_opts = []
        @_optsByKey = {}

        @_args = []

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
    Create new subcommand for current command.
    @returns {COA.Cmd} new subcommand instance
    ###
    cmd: -> new Cmd @

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
    @param {Boolean} [force=false] flag for set action instead add to existings
    @returns {COA.Cmd} this instance (for chainability)
    ###
    act: (act, force) ->
        return @_act unless act

        if not force and @_act
            oldAct = @_act
            @_act = ->
                oldAct.apply @, arguments
                act.apply @, arguments
        else
            @_act = act

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
        @_helpful = true
        @opt()
            .name('help').title('Help')
            .short('h').long('help')
            .type(Boolean)
            .act (opts, args) ->
                @exit @usage()
            .end()

    ###*
    Terminate program with error code 1.
    @param {String} msg message for print to STDERR
    @param {Object} [o] optional object for print with message
    ###
    errorExit: (msg, o) ->
        if msg then sys.error msg + (if o then ': ' + o else '')
        process.exit 1

    ###*
    Terminate program with error code 0.
    @param {String} msg message for print to STDERR
    ###
    exit: (msg) ->
        if msg then sys.error msg
        process.exit()

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
            if opts[pos]._push
                opts[pos]
            else
                opts.splice(pos, 1)[0]

    ###*
    Parse arguments from simple format like NodeJS process.argv.
    @param {Array} argv
    @returns {COA.Cmd} this instance (for chainability)
    ###
    parse: (argv) ->
        opts = {}
        args = {}
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
                    @errorExit('Unknown option', i)

            # cmd
            else if not nonParsedArgs and /^\w[\w-_]*$/.test i
                cmd = @_cmdsByName[i]
                if cmd
                    cmd.parse(argv)
                else
                    nonParsedArgs = @_args.concat()
                    argv.unshift(i)

            # arg
            else
                if arg = (nonParsedArgs or= @_args.concat()).shift()
                    if arg._push then nonParsedArgs.unshift arg
                    arg._parse i, args
                else
                    @errorExit 'Unknown argument', i

        nonParsedArgs or= @_args.concat()

        if not (this._helpful and opts.help)
            nonParsed = nonParsedOpts.concat nonParsedArgs
            while i = nonParsed.shift()
                if i._required and i._checkParsed opts, args
                    @errorExit i._requiredText()
                if '_def' of i
                    i._saveVal opts, i._def

        #console.log opts, args
        @_act? opts, args
        #@exit()
        @

    ###*
    Finish chain for current subcommand and return parent command instance.
    @returns {COA.Cmd} parent command
    ###
    end: -> @_cmd
