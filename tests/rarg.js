var argv = process.argv.slice(2);
require('../lib/coa').Cmd()
    .name('rarg')
    .title('Raw arg test')
    .helpful()
    .arg()
        .name('raw').title('Raw arg')
        .arr()
        .end()
    .act(function(opts, args) {
        console.log(args);
    })
    .run(argv.length? argv : ['--', 'raw', 'arg', 'values']);
