// accounts.js

export default function(app, database) {

    // show all accounts
    app.get('/accounts', (req, res) => {
        database.account.find().then(accounts => {
            res.render('accounts', { accounts: accounts })
        })
    })

    // get new account form
    app.get('/accounts/new', (req, res) => {
        res.render('accounts-new')
    })

    // show one account
    app.get('/accounts/:id', (req, res) => {
        database.account.findById(req.params.id).then(account => {
            res.render('account-show', { account: account })
        })
    })

    // create account
    app.post('/accounts', (req, res) => {
        console.log(req.body);
        var transformedEntry = { name: {} }
        transformedEntry.name = { first: req.body.firstName, last: req.body.lastName}
        console.log(transformedEntry);
        database.account.create(transformedEntry).then(account => {
            res.redirect('/accounts')
        }).catch(err => {
            console.log(err.message);
        })
    })
}
