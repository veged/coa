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
    .run(['-a', '1', '-a', '2']);
