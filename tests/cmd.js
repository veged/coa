require('../lib/coa').Cmd()
    .name('cmd')
    .title('Command test')
    .helpful()
    .cmd()
        .name('command')
        .title('Do command work')
        .helpful()
        .act(function() {
            console.log('Doing command work...');
        })
        .end()
    .run(['command']);
