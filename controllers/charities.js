// charities.js

export default function(app, database, modules) {

    // show all charities
    app.get('/charities', (req, res) => {
        res.render('charities')
    })

    // async show search results
    app.post('/charities/search', async (req, res) => {
        try {
            let search = await modules.axios.get(modules.charityNavigator.collection('10', '1', req.body.search))
            res.render('charities-search', {
                search: search
            })
        } catch (error) {
            console.log(error);
            res.render('charities-search', {
                error: error,
                query: req.body.search
            })
        }
    })

    // async show details for a single charity
    app.get('/charities/:ein', async (req, res, next) => {
        try {
            if (req.params.ein == 'test') {
                next();
            }
            let response = await modules.axios.get(modules.charityNavigator.organization(req.params.ein))
            let accounts = await database.account.find()
            res.render('charities-show', {
                charity: response.data,
                accounts: accounts
            })
        } catch (error) {
            console.log(error);
        }
    })

    // async add a charity to an account
    app.post('/charities/:ein/add', async (req, res) => {
        try {
            let charityQuery = {
                ein: req.params.ein
            }
            // check if we already have a local document in the db to represent
            // the charity
            let count = await database.charity.countDocuments(charityQuery)
            let charity = {}
            if (count == 0) {
                let newCharity = {
                    name: req.body.charityName,
                    ein: req.params.ein
                }
                charity = await database.charity.create(newCharity)
            } else {
                charity = await database.charity.findOne(charityQuery)
            }

            // find the selected account
            let accountQuery = {
                slug: req.body.slug
            }
            let account = await database.account.findOne(accountQuery).populate('charities')
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
            let updatedAccount = await account.save()

            res.redirect(`/accounts/${updatedAccount.slug}`)
        } catch(error) {
            console.log(error);
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
