cp = require 'child_process'
readline = require 'readline'
Q = require 'q'

module.exports = (opts) ->
    opts = opts || {};
    @act () ->
        defer = Q.defer()
        prompt = opts.prompt || process.env.PS2 || '> '
        input = opts.input || process.stdin
        output = opts.output || process.stdout

        rl = readline.createInterface {input: input, output: output, terminal: true}
        rl.setPrompt prompt, prompt.length

        rl.on 'line', (line) ->
            return r1.prompt() unless line = line.trim()

            child = cp.spawn(
                process.argv[0],
                process.argv.slice(1, 2).concat(line.split(' ')),
                { cwd: process.cwd(), customFds: [-1, 1, 2] }
            )

            child.on 'exit', -> rl.prompt()

        .on 'close', ->
            output.write '\n'
            process.stdin.destroy()
            defer.resolve()

        output.write 'Type \'--help\' for help, press ctrl+d or ctrl+c to exit\n'
        rl.prompt()

        defer.promise
