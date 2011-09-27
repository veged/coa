var argv = process.argv.slice(2);
require('../lib/coa').Cmd()
    .name('arr')
    .title('Array value test')
    .helpful()
    .opt()
        .name('arr').title('Array')
        .short('a').long('arr')
        .arr()
        .act(function(opts) {
            console.log(opts.arr);
        })
        .end()
    .run(argv.length? argv : ['-a', '1', '-a', '2']);
