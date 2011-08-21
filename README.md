# Command-Option-Argument

COA is a yet another parser for command line options.
You can choose one of the [existing modules](https://github.com/joyent/node/wiki/modules#parsers-commandline),
or write your own like me.

## Examples

````javascript
require('coa').Cmd() // main command declaration
    .name(process.argv[1])
    .title('My awesome command line util')
    .helpful()
    .opt()
        .name('version').short('v').long('version')
        .title('Version')
        .type(Boolean)
        .act(function(opts) {
            opts.version &&
                this.exit(
                    JSON.parse(require('fs').readFileSync(__dirname + '/package.json'))
                        .version);
        })
        .end()
    .cmd().name('subcommand').apply(require('./subcommand').COA).end() // load subcommand from module
    .cmd() // inplace subcommand declaration
        .name('othercommand')
        .title('Awesome other subcommand').helpful()
        .opt()
            .name('input').short('i').long('input')
            .title('input file, required')
            .validate(function(f) { return require('fs').createReadStream(f) })
            .required()
            .end()
        .end()
    .parse(process.argv.slice(2));
````

````javascript
// subcommand.js
exports.COA = function() {
    this
        .title('Awesome subcommand').helpful()
        .opt()
            .name('output').short('o').long('output')
            .title('output file')
            .output() // use default preset for "output" option declaration
            .end()
};
````

## API

### Cmd
Command is a top level entity. Commands may have options and arguments.<br>

#### Cmd.name
Set a canonical command identifier to be used anywhere in the API.<br>
**@param** *String* `_name` command name<br>
**@returns** *COA.Cmd* `this` instance (for chainability)<br>

#### Cmd.title
Set a long description for command to be used anywhere in text messages.<br>
**@param** *String* `_title` command title<br>
**@returns** *COA.Cmd* `this` instance (for chainability)<br>

#### Cmd.cmd
Create new subcommand for current command.<br>
**@returns** *COA.Cmd* `new` subcommand instance<br>

#### Cmd.opt
Create option for current command.<br>
**@returns** *COA.Opt* `new` option instance<br>

#### Cmd.arg
Create argument for current command.<br>
**@returns** *COA.Opt* `new` argument instance<br>

#### Cmd.act
Add (or set) action for current command.<br>
**@param** *Function* `act` action function,<br>
    invoked in the context of command instance<br>
    and has the parameters:<br>
        - *Object* `opts` parsed options<br>
        - *Array* `args` parsed arguments<br>
**@param** *{Boolean}* [force=false] flag for set action instead add to existings<br>
**@returns** *COA.Cmd* `this` instance (for chainability)<br>

#### Cmd.apply
Apply function with arguments in context of command instance.<br>
**@param** *Function* `fn`<br>
**@param** *Array* `args`<br>
**@returns** *COA.Cmd* `this` instance (for chainability)<br>

#### Cmd.helpful
Make command "helpful", i.e. add -h --help flags for print usage.<br>
**@returns** *COA.Cmd* `this` instance (for chainability)<br>

#### Cmd.errorExit
Terminate program with error code 1.<br>
**@param** *String* `msg` message for print to STDERR<br>
**@param** *{Object}* [o] optional object for print with message<br>

#### Cmd.exit
Terminate program with error code 0.<br>
**@param** *String* `msg` message for print to STDERR<br>

#### Cmd.usage
Build full usage text for current command instance.<br>
**@returns** *String* `usage` text<br>

#### Cmd.parse
Parse arguments from simple format like NodeJS process.argv.<br>
**@param** *Array* `argv`<br>
**@returns** *COA.Cmd* `this` instance (for chainability)<br>

#### Cmd.end
Finish chain for current subcommand and return parent command instance.<br>
**@returns** *COA.Cmd* `parent` command<br>

### Opt
Option is a named entity. Options may have short and long keys for use from command line.<br>
**@namespace**<br>
**@class** Presents option<br>

#### Opt.name
Set a canonical option identifier to be used anywhere in the API.<br>
**@param** *String* `_name` option name<br>
**@returns** *COA.Opt* `this` instance (for chainability)<br>

#### Opt.title
Set a long description for option to be used anywhere in text messages.<br>
**@param** *String* `_title` option title<br>
**@returns** *COA.Opt* `this` instance (for chainability)<br>


#### Opt.short
Set a short key for option to be used with one hyphen from command line.<br>
**@param** *String* `_short`<br>
**@returns** *COA.Opt* `this` instance (for chainability)<br>

#### Opt.long
Set a short key for option to be used with double hyphens from command line.<br>
**@param** *String* `_long`<br>
**@returns** *COA.Opt* `this` instance (for chainability)<br>

#### Opt.type
Set a type of option. Mainly using with Boolean for options without value.<br>
**@param** *Object* `_type`<br>
**@returns** *COA.Opt* `this` instance (for chainability)<br>

#### Opt.push
Makes an option accepts multiple values.<br>
Otherwise, the value will be used by the latter passed.<br>
**@returns** *COA.Opt* `this` instance (for chainability)<br>

#### Opt.required
Makes an option required.<br>
**@returns** *COA.Opt* `this` instance (for chainability)<br>

#### Opt.validate
Set a validation function for option.<br>
Value from command line passes through before becoming available from API.<br>
**@param** *Function* `_validate` validating function,<br>
    invoked in the context of option instance<br>
    and has one parameter with value from command line<br>
**@returns** *COA.Opt* `this` instance (for chainability)<br>

#### Opt.def
Set a default value for option.<br>
Default value passed through validation function as ordinary value.<br>
**@param** *Object* `_def`<br>
**@returns** *COA.Opt* `this` instance (for chainability)<br>

#### Opt.output
Make option value outputing stream.<br>
It's add useful validation and shortcut for STDOUT.<br>
**@returns** *COA.Opt* `this` instance (for chainability)<br>

#### Opt.act
Add action for current option command.<br>
This action is performed if the current option<br>
is present in parsed options (with any value).<br>
**@param** *Function* `act` action function,<br>
    invoked in the context of command instance<br>
    and has the parameters:<br>
        - *Object* `opts` parsed options<br>
        - *Array* `args` parsed arguments<br>
**@returns** *COA.Opt* `this` instance (for chainability)<br>

#### Opt.end
Finish chain for current option and return parent command instance.<br>
**@returns** *COA.Cmd* `parent` command<br>


### Arg
Argument is a unnamed entity.<br>
From command line arguments passed as list of unnamed values.<br>

#### Arg.name
Set a canonical argument identifier to be used anywhere in text messages.<br>
**@param** *String* `_name` argument name<br>
**@returns** *COA.Arg* `this` instance (for chainability)<br>

#### Arg.title
Set a long description for argument to be used anywhere in text messages.<br>
**@param** *String* `_title` argument title<br>
**@returns** *COA.Arg* `this` instance (for chainability)<br>

#### Arg.push
Makes an argument accepts multiple values.<br>
Otherwise, the value will be used by the latter passed.<br>
**@returns** *COA.Arg* `this` instance (for chainability)<br>

#### Arg.required
Makes an argument required.<br>
**@returns** *COA.Arg* `this` instance (for chainability)<br>

#### Arg.validate
Set a validation function for argument.<br>
Value from command line passes through before becoming available from API.<br>
**@param** *Function* `_validate` validating function,<br>
    invoked in the context of argument instance<br>
    and has one parameter with value from command line<br>
**@returns** *COA.Arg* `this` instance (for chainability)<br>

#### Arg.def
Set a default value for argument.<br>
Default value passed through validation function as ordinary value.<br>
**@param** *Object* `_def`<br>
**@returns** *COA.Arg* `this` instance (for chainability)<br>

#### Arg.output
Make argument value outputing stream.<br>
It's add useful validation and shortcut for STDOUT.<br>
**@returns** *COA.Arg* `this` instance (for chainability)<br>

#### Arg.end
Finish chain for current option and return parent command instance.<br>
**@returns** *COA.Cmd* `parent` command<br>


## TODO
* Program API for use COA-covered programs as modules
* Shell completion
* Localization
* Shell-mode
* Configs
  * Aliases
  * Defaults
