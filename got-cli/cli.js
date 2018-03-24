const
    app = require('./app'),
    yargs = require('yargs')


const flags = yargs.usage('$0: Usage <cmd>')
    .command({
        command: 'search',
        desc: 'search api by query',
        handler: (argv) => {
            app.search()
        }
    })
    .demandCommand()
    .help('help')
    .argv