require('../lib/coa').Cmd()
    .name('bla')
    .title('Bla bla bla')
    .helpful()
    .opt()
        .name('version').title('Version')
        .short('v').long('version')
        .flag()
        .act(function(opts, args) {
            return this.resolve(JSON.parse(require('fs').readFileSync(__dirname + '/../package.json'))
                .version)
        })
        .end()
    .act(function() {
        console.log('... doing hard work ...')
    })
    .run(['-v']);
