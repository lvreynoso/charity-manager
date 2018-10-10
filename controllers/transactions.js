// transactions.js

export default function(app, database, modules) {
    // resourceful index
    app.get('/transactions', (req, res) => {
        res.render('transactions');
    })

    // async resourceful new
    app.get('/accounts/:slug/transactions/new', async (req, res) => {
        try {
            let query = {
                slug: req.params.slug
            }
            let account = await database.account.findOne(query)
            res.render('transactions-new', {
                account: account
            })
        } catch (error) {
            console.log(error);
        }
    })

    // a truly great artist knows when to break convention
    // to be fixed with ajax
    app.post('/accounts/:slug/transactions/new', async (req, res) => {
        try {
            let query = {
                slug: req.params.slug
            }
            let charity = {
                _id: req.body._id,
                charityName: req.body.name,
                ein: req.body.ein
            }
            let account = await database.account.findOne(query)
            res.render('transactions-new', {
                account: account,
                charity: charity
            })
        } catch (error) {
            console.log(error);
        }
    })

    // async resourceful create
    app.post('/accounts/:slug/transactions', async (req, res) => {
        try {
            let account = await database.account.findById(req.body.account)
            var newTransaction = req.body;

            // date fixing code
            if (req.body.fallback) {
                newTransaction.date = new Date(req.body.day + ' ' + req.body.month + ', ' + req.body.year);
            }
            account.donations.push(newTransaction);

            // sort donations by date
            account.donations.sort(function(a, b) {
                if (a.date.getTime() < b.date.getTime()) {
                    return 1;
                }
                if (a.date.getTime() > b.date.getTime()) {
                    return -1;
                }

                return 0;
            })
            // save the account
            let updatedAccount = await account.save()
            // redirect back to the account's show page
            res.redirect(`/accounts/${account.slug}`)
        } catch (error) {
            console.log(error);
        }

    })

    // resourceful edit
    app.get('/accounts/:slug/transactions/:id/edit', async (req, res) => {
        try {
            let query = {
                slug: req.params.slug
            }
            let account = await database.account.findOne(query)
            var transaction = account.donations.id(req.params.id);
            res.render('transactions-edit', {
                account: account,
                transaction: transaction
            })
        } catch (error) {
            console.log(error);
        }
    })

    // resourceful update
    app.put('/accounts/:slug/transactions/:id', async (req, res) => {
        try {
            let account = await database.account.findById(req.body.accountId)
            var editedDonation = account.donations.id(req.params.id)
            var updatedInfo = req.body;

            // date fixing code
            if (req.body.fallback) {
                updatedInfo.date = new Date(req.body.day + ' ' + req.body.month + ', ' + req.body.year);
            }

            editedDonation.set(updatedInfo);
            editedDonation.markModified('date');

            // sort donations by date
            account.donations.sort(function(a, b) {
                if (a.date.getTime() < b.date.getTime()) {
                    return 1;
                }
                if (a.date.getTime() > b.date.getTime()) {
                    return -1;
                }

                return 0;
            })

            let response = await account.save()
            res.redirect(`/accounts/${account.slug}`);

        } catch (error) {
            console.log(error);
        }
    })

    // resourceful destroy
    app.delete('/accounts/:slug/transactions/:id', async (req, res) => {
        try {
            let account = await database.account.findById(req.body.accountId)
            account.donations.id(req.params.id).remove();
            let response = await account.save()
            res.redirect(`/accounts/${account.slug}`)
        } catch (error) {
            console.log(error);
        }
    })


}
