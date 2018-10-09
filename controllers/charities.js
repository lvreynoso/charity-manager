// charities.js

export default function(app, database, modules) {

    // show all charities
    app.get('/charities', (req, res) => {
        res.render('charities')
    })

    // show search results
    app.post('/charities/search', (req, res) => {
        modules.axios.get(modules.charityNavigator.collection('10', '1', req.body.search))
            .then(search => {
                res.render('charities-search', {
                    search: search
                })
            })
            .catch(error => {
                console.log(error);
                res.render('charities-search', {
                    error: error,
                    query: req.body.search
                })
            })
    })

    // show details for a single charity
    app.get('/charities/:ein', (req, res, next) => {
        if (req.params.ein == 'test') {
            next();
        }
        modules.axios.get(modules.charityNavigator.organization(req.params.ein))
            .then(response => {
                database.account.find().then(accounts => {
                    res.render('charities-show', {
                        charity: response.data,
                        accounts: accounts
                    })
                })
            })
            .catch(error => {
                console.log(error);
            })
    })

    // add a charity to an account
    app.post('/charities/:ein/add', (req, res) => {
        // check if we already have the charity in the local database
        let charityQuery = {
            ein: req.params.ein
        }
        database.charity.countDocuments(charityQuery)
        .then(count => {
            if (count == 0) {
                let newCharity = { name: req.body.charityName, ein: req.params.ein }
                database.charity.create(newCharity)
                .then(charity => {
                    addToAccount(charity)
                })
                .catch(error => {
                    console.log(error);
                })
            } else {
                database.charity.findOne(charityQuery)
                .then(charity => {
                    addToAccount(charity)
                })
                .catch(error => {
                    console.log(error);
                })
            }
        })
        .catch(error => {
            console.log(error);
        })

        // associate the charity with the account
        function addToAccount(charity) {
            let accountQuery = { slug: req.body.slug }
            database.account.findOne(accountQuery)
            .populate('charities')
            .then(account => {
                // check if the charity is already associated with the account
                let uniqueCharity = true
                account.charities.forEach(function(element) {
                    if (String(element._id) == String(charity._id)) {
                        uniqueCharity = false
                    }
                })
                if (uniqueCharity) {
                    account.charities.push(charity)
                }
                account.save()
                .then(savedAccount => {
                    redirectToAccount(account.slug)
                })
                .catch(error => {
                    console.log(error);
                })
            })
            .catch(error => {
                console.log(error);
            })
        }

        function redirectToAccount(slug) {
            res.redirect(`/accounts/${slug}`)
        }
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
