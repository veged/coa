var program = require('../lib/coa').Cmd()
    .name('cmd')
    .title('Command test')
    .helpful()
    .cmd()
        .name('command')
        .title('Do command work')
        .helpful()
        .cmd()
            .name('subcommand')
            .title('Do subcommand work')
            .helpful()
            .act(function() {
                console.log('Doing subcommand work...');
            })
            .end()
        .act(function() {
            console.log('Doing a lot of command work...');
        })
        .end()
    .act(function() {
        console.log('Doing nothing...');
    });

program.api().end();
program.api.command().end();
program.api.command.subcommand().end();
