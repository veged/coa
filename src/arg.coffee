Color = require('./color').Color
Cmd = require('./cmd').Cmd
Opt = require('./opt').Opt

###*
## Argument
Unnamed entity. From command line arguments passed as list of unnamed values.
@namespace
@class Presents argument
###
exports.Arg = class Arg

    ###*
    @constructs
    @param {COA.Cmd} cmd parent command
    ###
    constructor: (@_cmd) -> @_cmd._args.push @

    ###*
    Set a canonical argument identifier to be used anywhere in text messages.
    @param {String} _name argument name
    @returns {COA.Arg} this instance (for chainability)
    ###
    name: Opt::name

    ###*
    Set a long description for argument to be used anywhere in text messages.
    @param {String} _title argument title
    @returns {COA.Arg} this instance (for chainability)
    ###
    title: Cmd::title

    ###*
    Makes an argument accepts multiple values.
    Otherwise, the value will be used by the latter passed.
    @returns {COA.Arg} this instance (for chainability)
    ###
    arr: Opt::arr

    ###*
    Makes an argument required.
    @returns {COA.Arg} this instance (for chainability)
    ###
    req: Opt::req

    ###*
    Set a validation (or value) function for argument.
    Value from command line passes through before becoming available from API.
    Using for validation and convertion simple types to any values.
    @param {Function} _val validating function,
        invoked in the context of argument instance
        and has one parameter with value from command line
    @returns {COA.Arg} this instance (for chainability)
    ###
    val: Opt::val

    ###*
    Set a default value for argument.
    Default value passed through validation function as ordinary value.
    @param {Object} _def
    @returns {COA.Arg} this instance (for chainability)
    ###
    def: Opt::def

    ###*
    Make argument value outputing stream.
    It's add useful validation and shortcut for STDOUT.
    @returns {COA.Arg} this instance (for chainability)
    ###
    output: Opt::output

    _parse: (arg, args) ->
        @_saveVal(args, arg)

    _saveVal: Opt::_saveVal

    _checkParsed: (opts, args) -> not args.hasOwnProperty(@_name)

    _usage: -> Color('lpurple', @_name.toUpperCase()) + ' : ' + @_title

    _requiredText: -> 'Missing required argument:\n  ' + @_usage()

    ###*
    Finish chain for current option and return parent command instance.
    @returns {COA.Cmd} parent command
    ###
    end: Cmd::end
