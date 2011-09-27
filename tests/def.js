var argv = process.argv.slice(2);
require('../lib/coa').Cmd()
    .name('def')
    .title('Default value test')
    .helpful()
    .opt()
        .name('a').title('Value A')
        .short('a')
        .def('aaa')
        .act(function(opts) {
            console.log('a=' + opts.a);
        })
        .end()
    .opt()
        .name('b').title('Value B')
        .short('b')
        .def('bbb')
        .act(function(opts) {
            console.log('b=' + opts.b);
        })
        .end()
    .act(function(opts) {
        console.log(opts);
    })
    .run(argv.length? argv : ['-a', '1']);
