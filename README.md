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
        .end()
    .act(function(opts) {
        opts.version &&
            this.exit(
                JSON.parse(require('fs').readFileSync(__dirname + '/package.json'))
                    .version);
    })
    .cmd().name('subcommand).apply(require('./subcommand').COA).end() // load subcommand from module
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

## TODO
* Program API for use COA-covered programs as modules
* Localization
* Shell completion
* Configs
  * Aliases
  * Defaults