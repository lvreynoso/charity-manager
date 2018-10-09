// transactions.js

export default function(app, database, modules) {
    // resourceful index
    app.get('/transactions', (req, res) => {
        res.render('transactions');
    })

    // resourceful new
    app.get('/accounts/:slug/transactions/new', (req, res) => {
        let query = { slug: req.params.slug }
        database.account.findOne(query).then(account => {
            res.render('transactions-new', { account: account })
        })
    })

    // resourceful create
    app.post('/accounts/:slug/transactions', (req, res) => {
        database.account.findById(req.body.account).then(account => {
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

    // resourceful show
    app.get('/transactions/:id', (req, res) => {
        //console.log("transaction show");
        database.account.findById(req.accountId).then(account => {
            account.transactions.findById(req.params.id).then(transaction => {
                res.render('transactions-show', {
                    account: account,
                    transaction: transaction
                })
            }).catch(err => {
                console.log(err.message);
            })
        }).catch(err => {
            console.log(err.message);
        })
    })

    // resourceful edit
    app.get('/accounts/:slug/transactions/:id/edit', (req, res) => {
        //console.log("transaction edit");
        let query = { slug: req.params.slug }
        database.account.findOne(query).then(account => {
            var transaction = account.donations.id(req.params.id);
            res.render('transactions-edit', {
                account: account,
                transaction: transaction
            })
        }).catch(err => {
            console.log(err.message);
        })
    })

    // resourceful update
    app.put('/accounts/:slug/transactions/:id', (req, res) => {
        //console.log("transaction update");
        database.account.findById(req.body.accountId).then(account => {
            var editedDonation = account.donations.id(req.params.id)
            var updatedInfo = req.body;

            // date fixing code
            if (req.body.fallback) {
                updatedInfo.date = new Date(req.body.day + ' ' + req.body.month + ', ' + req.body.year);
            }

            editedDonation.set(updatedInfo);
            editedDonation.markModified('date');
            account.save().then(response => {
                res.redirect(`/accounts/${account.slug}`);
            })
        }).catch(err => {
            console.log(err.message);
        })
    })

    // resourceful destroy
    app.delete('/accounts/:slug/transactions/:id', (req, res) => {
        database.account.findById(req.body.accountId).then(account => {
            account.donations.id(req.params.id).remove();
            account.save().then(response => {
                res.redirect(`/accounts/${account.slug}`)
            }).catch(err => {
                console.log(err.message);
            })
        }).catch(err => {
            console.log(err.message);
        })
    })


}
