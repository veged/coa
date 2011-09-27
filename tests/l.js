var argv = process.argv.slice(2);
require('../lib/coa').Cmd()
    .name('bla')
    .title('Bla bla bla')
    .helpful()
    .opt()
        .name('long1').title('Long1')
        .short('l').long('long1')
        .act(function(opts) {
            console.log(opts.long1);
        })
        .end()
    .opt()
        .name('long2').title('Long2')
        .short('L').long('long2')
        .act(function(opts) {
            console.log(opts.long2);
        })
        .end()
    .act(function(opts) { console.log(opts) })
    .run(argv.length? argv : ['--long1', '111', '--long2', '222']);
