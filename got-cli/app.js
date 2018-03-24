const
    api = require('got-app'),
    inquirer = require('inquirer')

const getByID = () => {
    searchPrompt()
    .then((answers) => {
        const{searchTypePrompt = 'characters'} = answers

        idPrompt()
        .then((answers) => {
            const{idPrompt = 1} = answers

            api.getByID(searchTypePrompt, idPrompt)
            .then((result) => {
                // console.log(result)
                print(result)
            })
        })
    })
}

const search = (query) => {
    if(query.length){
        query = query.join(' ')
        api.search('characters', 1, 10, 'name', query)
        .then(result => {
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
                        pagePromptHandler(searchTypePrompt, 1, pageSizePrompt)
                    }
                    else if(searchQueryTypePrompt === 'male'){
                        pagePromptHandler(searchTypePrompt, 1, pageSizePrompt, 'gender', 'male')
                    }
                    else if(searchQueryTypePrompt === 'female'){
                        pagePromptHandler(searchTypePrompt, 1, pageSizePrompt, 'gender', 'female')
                    }
                    else if(searchQueryTypePrompt === 'alive'){
                        pagePromptHandler(searchTypePrompt, 1, pageSizePrompt, 'isAlive', 'true')
                    }
                    else if(searchQueryTypePrompt === 'dead'){
                        pagePromptHandler(searchTypePrompt, 1, pageSizePrompt, 'isAlive', 'false')
                    }
                    else{
                        queryPrompt().then((answers) => {
                            const{queryPrompt = ''} = answers
                            pagePromptHandler(searchTypePrompt, 1, pageSizePrompt, searchQueryTypePrompt, queryPrompt)
                        })
                    }
                })
            })
        })
    }
}

const print = (result) => {
    if(result.length){
        result.forEach(function(element) {
            for(key in element){
                if(element[key].length === 0  || element[key][0] === '')
                console.log(`${key} : None`)
                else {
                    console.log(`${key} : ${element[key]}`)
                }
            }
            console.log(`------------------------------------------------------------------------\n`)
        })
    }
    else if(result != ''){
        for(key in result){
            if(result[key].length === 0  || result[key][0] === '')
            console.log(`${key} : None`)
            else {
                console.log(`${key} : ${result[key]}`)
            }
        }
        console.log(`------------------------------------------------------------------------\n`)
    }
    else {
        console.log(`There are no results to be shown.`)
    }
} 

const pagePrompt = () => {
    return inquirer.prompt([{
        type: 'list',
        message: 'select a category to search',
        name: 'pagePrompt',
        choices: ['next', 'prev', 'exit']
    }])
}

const pagePromptHandler = (searchType, page = 1, pageSize = 10, queryType = null, query = null, answers = null) => {
    if(answers == null){
        api.search(searchType, page, pageSize, queryType, query)
        .then(result => {
            print(result)
            
            pagePrompt()
            .then(answers => {
                pagePromptHandler(searchType, page, pageSize, queryType, query, answers)
            })
        })
    }
    else{
        if(answers.pagePrompt === 'next'){
            page = page+1
            api.search(searchType, page, pageSize, queryType, query)
            .then(result => {
                print(result)
                
                pagePrompt()
                .then(answers => {
                    pagePromptHandler(searchType, page, pageSize, queryType, query, answers)
                })
            })
        }
        else if(answers.pagePrompt === 'prev'){
            page = (page-1 <= 0) ? 1 : page-1
            api.search(searchType, page, pageSize, queryType, query)
            .then(result => {
                print(result)
                
                pagePrompt()
                .then(answers => {
                    pagePromptHandler(searchType, page, pageSize, queryType, query, answers)
                })
            })
        }
    }
}

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

const idPrompt = () => {
    return inquirer.prompt([{
        type: 'input',
        name: 'idPrompt',
        message: "Enter the ID: ",
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
    search,
    getByID
}