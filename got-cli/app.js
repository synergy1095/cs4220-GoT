const
    api = require('got-app'),
    inquirer = require('inquirer')

const search = (query) => {
    if(query.length){
        query = query.join(' ')
        api.search('characters', 10, 'name', query)
        .then(result => {
            if(result.length)
                print(result)
        })
    }
    else{
        pageSizePrompt().then((answers) => {
            const{pageSizePrompt = '10'} = answers

            searchPrompt().then((answers) => {
                const{searchTypePrompt = 'characters'} = answers
                // console.log(searchTypePrompt)
                queryTypePrompt(searchTypePrompt).then((answers) => {
                    const{searchQueryTypePrompt = 'name'} = answers

                    // console.log(searchTypePrompt + ' ' + searchQueryTypePrompt)
                    if(searchQueryTypePrompt === 'show all'){
                        api.search(searchTypePrompt, pageSizePrompt)
                        .then(result => {
                            print(result)
                        })
                    }
                    else if(searchQueryTypePrompt === 'male'){
                        api.search(searchTypePrompt, pageSizePrompt, 'gender', 'male')
                        .then(result => {
                            print(result)
                        })
                    }
                    else if(searchQueryTypePrompt === 'female'){
                        api.search(searchTypePrompt, pageSizePrompt, 'gender', 'female')
                        .then(result => {
                            print(result)
                        })
                    }
                    else if(searchQueryTypePrompt === 'alive'){
                        api.search(searchTypePrompt, pageSizePrompt, 'isAlive', 'true')
                        .then(result => {
                            print(result)
                        })
                    }
                    else if(searchQueryTypePrompt === 'dead'){
                        api.search(searchTypePrompt, pageSizePrompt, 'isAlive', 'false')
                        .then(result => {
                            print(result)
                        })
                    }
                    else{
                        queryPrompt().then((answers) => {
                            const{queryPrompt = ''} = answers
                            api.search(searchTypePrompt, pageSizePrompt, searchQueryTypePrompt, queryPrompt)
                            .then(result => {
                                print(result)
                            })
                        })
                    }
                })
            })
        })
    }
}

const print = (result) => {
    console.log(result)
} 

const books = () => {
    let results = [] 
    api.books()
        .then(res => selectPrompt(res))
        
        // .then(result => {
        //     console.log('-- CARDS --')
        //     result.cards.forEach(card => {
        //         console.log(`${card.value} of ${card.suit}`)
        //     })

        //     console.log('-- REMAING CARDS --')
        //     console.log(result.remaining)
        // })
        .catch(err => console.log(err))
}

// const getTypes = () => {
//     return api.getTypes()
// }

const searchPrompt = () => {
    let choices = api.getTypes()

    return inquirer.prompt([{
        type: 'list',
        message: 'select a category to search',
        name: 'searchTypePrompt',
        choices: choices
    }])
}

const queryTypePrompt = (type) => {
    let choices = api.getQueryTypes(type)

    return inquirer.prompt([{
        type: 'list',
        message: 'select a sub-category to search',
        name: 'searchQueryTypePrompt',
        choices: choices
    }])
}

const queryPrompt = () => {
    return inquirer.prompt([{
        type: 'input',
        name: 'queryPrompt',
        message: "Enter your search query: ",
        validate: function(value) {
            return true
        }
    }])
}

const pageSizePrompt = () => {
    return inquirer.prompt([{
        type: 'input',
        name: 'pageSizePrompt',
        message: "Enter the number of entries you want displayed: ",
        validate: function(value) {
            let pass = parseInt(value, 10)
            if (!isNaN(pass)) {
                return true;
            }

            return 'Please enter a valid number';
        }
    }])
}

module.exports = {
    search
}