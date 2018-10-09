// accounts.js

export default function(app, database, modules) {

    // show all accounts
    app.get('/accounts', (req, res) => {
        database.account.find().then(accounts => {
            res.render('accounts', {
                accounts: accounts
            })
        })
    })

    // get new account form
    app.get('/accounts/new', (req, res) => {
        res.render('accounts-new')
    })

    // show one account
    app.get('/accounts/:slug', (req, res) => {
        let query = {
            slug: req.params.slug
        }
        database.account.findOne(query)
        .populate('charities')
        .then(account => {
            res.render('accounts-show', {
                account: account
            })
        })
        .catch(error => {
            console.log(error);
        })
    })

    // edit account information
    app.get('/accounts/:slug/edit', (req, res) => {
        let query = {
            slug: req.params.slug
        }
        database.account.findOne(query)
        .then(account => {
            res.render('accounts-edit', {
                account: account
            })
        })
        .catch(error => {
            console.log(error);
        })
    })

    // update account information
    app.put('/accounts/:slug', (req, res) => {
        // transform req.body to conform to our database model
        var transformedEntry = {
            name: {}
        }
        transformedEntry.name = {
            first: req.body.firstName,
            last: req.body.lastName
        }
        var query = {
            _id: req.body.mongoId
        }
        database.account.findOne(query)
            .then(account => {
                account.set(transformedEntry)
                // create a new slug for the updated account
                let mongoId = String(account._id).substring(String(account._id).length - 4)
                account.slug = modules.slug(account.name.full + ' ' + mongoId)
                account.save()
                    .then(account => {
                        res.redirect(`/accounts/${account.slug}`)
                    })
                    .catch(error => {
                        console.log(error);
                    })
            })
            .catch(error => {
                console.log(error);
            })
    })

    // create account
    app.post('/accounts', (req, res) => {
        // transform req.body to conform to our database model
        var transformedEntry = {
            name: {}
        }
        transformedEntry.name = {
            first: req.body.firstName,
            last: req.body.lastName
        }
        database.account.create(transformedEntry)
        .then(account => {
            // create a slug for the new account
            let mongoId = String(account._id).substring(String(account._id).length - 4)
            account.slug = modules.slug(account.name.full + ' ' + mongoId)
            account.save()
            .then(account => {
                res.redirect(`/accounts`)
            })
            .catch(error => {
                console.log(error);
            })
        })
        .catch(err => {
            console.log(err.message);
        })
    })

    app.delete('/accounts/:id', (req, res) => {
        var query = {
            _id: req.params.id
        }
        database.account.findOneAndDelete(query)
        .then(account => {
            res.redirect(`/accounts`)
        })
        .catch(error => {
            console.log(error);
        })
    })
}
