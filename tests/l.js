require('coa').Cmd()
    .name('bla')
    .title('Bla bla bla')
    .helpful()
    .opt()
        .name('long').title('Long')
        .short('long').long('long')
        .act(function(opts) {
            this.exit(opts.long);
        })
        .end()
    .parse(['--long', '111']);
