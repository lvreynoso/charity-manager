// portfolio.js
// top priority: minimum viable product page

export default function(app, database) {
    // resourceful index
    app.get('/transactions', (req, res) => {
        res.render('transactions');
    })

    // resourceful new
    app.get('/transactions/new', (req, res) => {
        res.render('transactions-new')
    })

    // resourceful create
    app.post('/transactions', (req, res) => {
        database.account.findById(req.body.account).then(account => {
            console.log(req.body);
            account.donations.push(req.body);
            account.save().then(transaction => {
                // res.redirect(`/transactions/${transaction._id}`)
                res.redirect(`/accounts/${req.body.account}`)
            }).catch(err => {
                console.log(err.message);
            })
        }).catch(err => {
            console.log(err.message);
        })
    })

    // resourceful show
    app.get('/transactions/:id', (req, res) => {
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
    app.get('/transactions/:id/edit', (req, res) => {
        database.account.findById(req.accountId).then(account => {
            account.transactions.findById(req.params.id).then(transaction => {
                res.render('transactions-edit', {
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

    // resourceful update
    app.put('/transactions/:id', (req, res) => {
        database.account.findById(req.accountId).then(account => {
            account.transactions.findById(req.params.id).then(transaction => {
                transaction = req.body;
                account.save().then(transaction => {
                    res.redirect(`/transactions/${req.params.id}`)
                }).catch(err => {
                    console.log(err.message);
                })
            }).catch(err => {
                console.log(err.message);
            })
        }).catch(err => {
            console.log(err.message);
        })
    })

    // resourceful destroy
    app.delete('/accounts/:accountId/transactions/:id', (req, res) => {
        database.account.findById(req.params.accountId).then(account => {
            account.donations.id(req.params.id).remove();
            account.save().then(response => {
                res.redirect(`/accounts/${req.params.accountId}`)
            }).catch(err => {
                console.log(err.message);
            })
        }).catch(err => {
            console.log(err.message);
        })
    })


}
