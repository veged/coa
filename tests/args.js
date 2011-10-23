var argv = process.argv.slice(2);
require('../lib/coa').Cmd()
    .name('arg')
    .title('Args test')
    .helpful()
    .arg()
        .name('arg1').title('First arg')
        .end()
    .arg()
        .name('arg2').title('Second array arg')
        .arr()
        .end()
    .act(function(opts, args) {
        console.log(args);
    })
    .run(argv.length? argv : ['value', 'value 1', 'value 2']);
