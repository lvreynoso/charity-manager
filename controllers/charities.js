// charities.js

export default function(app, database, modules) {

    // show all charities
    app.get('/charities', (req, res) => {
        res.render('charities')
    })

    // show search results
    app.post('/charities/search', (req, res) => {
        console.log(req.body);
        modules.axios.get(modules.charityNavigator.collection('10', '1', req.body.search))
        .then(search => {
            res.render('charities-search', { search: search })
        })
        .catch(error => {
            res.render('charities-search', { error: error, query: req.body.search })
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
