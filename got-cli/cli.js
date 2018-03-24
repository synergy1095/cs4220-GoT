const
    app = require('./app'),
    yargs = require('yargs')


const flags = yargs.usage('$0: Usage <cmd>')
    .command({
        command: 'search',
        desc: 'search api by query. Usage: cli.js search <query> or cli.js search.',
        handler: (argv) => {
            let query = argv['_']
            query.shift()
            app.search(query)
        }
    })
    .command({
        command: 'id',
        desc: 'look up by id. Usage: cli.js id',
        handler: (argv) => {
            app.getByID()
        }
    })
    .demandCommand()
    .help('help')
    .argv