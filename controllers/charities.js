// charities.js

export default function(app, database, modules) {

    // show charity search page
    app.get('/charities', (req, res) => {
        res.render('charities')
    })

    // async show search results
    app.post('/charities/search', async (req, res) => {
        let search = await modules.axios.get(modules.charityNavigator.collection('10', '1', req.body.search))
            .catch(err => {
                console.log(err)
                res.render('charities-search', {
                    error: err,
                    query: req.body.search
                })
            })
        res.render('charities-search', {
            search: search
        })

    })

    // async show details for a single charity
    app.get('/charities/:ein', async (req, res, next) => {
        // test function hook
        if (req.params.ein == 'test') {
            next();
        }
        // look up org info in charity navigator
        let response = await modules.axios.get(modules.charityNavigator.organization(req.params.ein))
            .catch(err => console.log(err))
        // get list of accounts for the dropdown menu
        let accounts = await database.account.find().catch(err => console.log(err))
        res.render('charities-show', {
            charity: response.data,
            accounts: accounts
        })
    })

    // async add a charity to an account
    app.post('/charities/:ein/add', async (req, res) => {
        let charityQuery = {
            ein: req.params.ein
        }
        // check if we already have a local document in the db to represent
        // the charity
        let count = await database.charity.countDocuments(charityQuery)
            .catch(err => console.log(err))
        let charity = {}
        if (count == 0) {
            let newCharity = {
                name: req.body.charityName,
                ein: req.params.ein
            }
            charity = await database.charity.create(newCharity)
                .catch(err => console.log(err))
        } else {
            charity = await database.charity.findOne(charityQuery)
                .catch(err => console.log(err))
        }

        // find the selected account
        let accountQuery = {
            slug: req.body.slug
        }
        let account = await database.account.findOne(accountQuery).populate('charities')
            .catch(err => console.log(err))
        // check if the account already contains the charity
        // i can think of a way to do this while checking if the charity is
        // in the db, but whatevs i'm short on time
        let uniqueCharity = true
        account.charities.forEach(function(element) {
            if (`${element._id}` == `${charity._id}`) {
                uniqueCharity = false
            }
        })
        // add the charity to the account
        if (uniqueCharity) {
            account.charities.push(charity)
        }
        let updatedAccount = await account.save().catch(err => console.log(err))

        res.redirect(`/accounts/${updatedAccount.slug}`)
    })

    // test our charity navigator api wrapper
    app.get('/charities/test', (req, res) => {
        let test = {
            result: {},
            collection: {},
            organization: {}
        };
        test.result.query = modules.charityNavigator.test();
        test.collection.query = modules.charityNavigator.collection('10', '1', 'fire')
        modules.axios.get(modules.charityNavigator.collection('10', '1', 'fire'))
            .then(collection => {
                test.collection.response = collection;
                test.organization.query = modules.charityNavigator.organization('411867244');
                modules.axios.get(modules.charityNavigator.organization('411867244')) // test ein
                    .then(organization => {
                        test.organization.response = organization;
                        res.render('charities-test', {
                            test: test
                        })
                    })
                    .catch(error => {
                        console.log(error);
                        test.organization.response = String(error.response.status + ' ' + error.response.statusText)
                        res.render('charities-test', {
                            test: test
                        })
                    })
            })
            .catch(error => {
                console.log(error);
                res.render('charities-test', {
                    test: test
                })
            })
    })
}
