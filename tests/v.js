var argv = process.argv.slice(2);
require('../lib/coa').Cmd()
    .name('bla')
    .title('Bla bla bla')
    .helpful()
    .opt()
        .name('version').title('Version')
        .short('v').long('version')
        .flag()
        .only()
        .act(function(opts, args) {
            return JSON.parse(
                require('fs').readFileSync(__dirname + '/../package.json'))
                    .version
        })
        .end()
    .opt()
        .name('req').title('Required')
        .short('r').long('long')
        .req()
        .end()
    .act(function() {
        console.log('... doing hard work ...')
    })
    .run(argv.length? argv : ['-v']);
