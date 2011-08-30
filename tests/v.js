require('../lib/coa').Cmd()
    .name('bla')
    .title('Bla bla bla')
    .helpful()
    .opt()
        .name('version').title('Version')
        .short('v').long('version')
        .flag()
        .act(function(opts) {
            this.exit(
                JSON.parse(require('fs').readFileSync(__dirname + '/../package.json'))
                    .version);
        })
        .end()
    .parse(['-v']);
