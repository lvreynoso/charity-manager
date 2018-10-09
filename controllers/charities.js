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
            res.render('charities-search', { search: search })
        })
        .catch(error => {
            console.log(error);
            res.render('charities-search', { error: error, query: req.body.search })
        })
    })

    // show details for a single charity
    app.get('/charities/:ein', (req, res, next) => {
        if (req.params.ein == 'test') {
            next();
        }
        modules.axios.get(modules.charityNavigator.organization(req.params.ein))
        .then(response => {
            res.render('charities-show', { charity: response.data })
        })
        .catch(error => {
            console.log(error);
        })
    })

    // make a donation to a single charity
    app.get('/charities/:ein/donate', (req, res) => {
        modules.axios.get(modules.charityNavigator.organization(req.params.ein))
        .then(response => {
            let charity = response.data
            charity.charity = response.data.charityName
            database.account.find().then(accounts => {
                res.render('charities-donate', { charity: charity, accounts: accounts })
            })
            .catch(error => {
                console.log(error);
            })
        })
    })

    // submit donation to that charity
    app.post('/charities/:ein/donate', (req, res) => {
        let query = { slug: req.body.slug }
        delete req.body['slug'];
        database.account.findOne(query).then(account => {
            var newTransaction = req.body;

            // date fixing code
            if (req.body.fallback) {
                newTransaction.date = new Date(req.body.day + ' ' + req.body.month + ', ' + req.body.year);
            }

            account.donations.push(newTransaction);
            account.save().then(transaction => {
                res.redirect(`/accounts/${account.slug}`)
            }).catch(err => {
                console.log(err.message);
            })
        }).catch(err => {
            console.log(err.message);
        })
    })

    // test our charity navigator api wrapper
    app.get('/charities/test', (req, res) => {
        let test = { result: {}, collection: {}, organization: {} };
        test.result.query = modules.charityNavigator.test();
        test.collection.query = modules.charityNavigator.collection('10', '1', 'fire')
        modules.axios.get(modules.charityNavigator.collection('10', '1', 'fire'))
        .then(collection => {
            test.collection.response = collection;
            test.organization.query = modules.charityNavigator.organization('411867244');
            modules.axios.get(modules.charityNavigator.organization('411867244')) // test ein
            .then(organization => {
                test.organization.response = organization;
                res.render('charities-test', { test: test })
            })
            .catch(error => {
                console.log(error);
                test.organization.response = String(error.response.status + ' ' + error.response.statusText)
                res.render('charities-test', { test: test })
            })
        })
        .catch(error => {
            console.log(error);
            res.render('charities-test', { test: test })
        })
    })
}
