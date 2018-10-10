// transactions.js

export default function(app, database, modules) {
    // resourceful index
    app.get('/transactions', (req, res) => {
        res.render('transactions');
    })

    // async resourceful new
    app.get('/accounts/:slug/transactions/new', async (req, res) => {
        let query = {
            slug: req.params.slug
        }
        let account = await database.account.findOne(query).catch(err => console.log(err))
        res.render('transactions-new', {
            account: account
        })
    })

    // a truly great artist knows when to break convention
    // to be fixed with ajax
    app.post('/accounts/:slug/transactions/new', async (req, res) => {
        let query = {
            slug: req.params.slug
        }
        let charity = {
            _id: req.body._id,
            charityName: req.body.name,
            ein: req.body.ein
        }
        let account = await database.account.findOne(query).catch(err => console.log(err))
        res.render('transactions-new', {
            account: account,
            charity: charity
        })
    })

    // async resourceful create
    app.post('/accounts/:slug/transactions', async (req, res) => {
        let query = {
            slug: req.params.slug
        }
        let account = await database.account.findOne(query)
            .catch(err => console.log(err))
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
        let updatedAccount = await account.save().catch(err => console.log(err))
        // redirect back to the account's show page
        res.redirect(`/accounts/${account.slug}`)
    })

    // resourceful edit
    app.get('/accounts/:slug/transactions/:id/edit', async (req, res) => {
        let query = {
            slug: req.params.slug
        }
        let account = await database.account.findOne(query).catch(err => console.log(err))
        var transaction = account.donations.id(req.params.id);
        res.render('transactions-edit', {
            account: account,
            transaction: transaction
        })
    })

    // resourceful update
    app.put('/accounts/:slug/transactions/:id', async (req, res) => {
        let query = {
            slug: req.params.slug
        }
        let account = await database.account.findOne(query)
            .catch(err => console.log(err))
        var editedDonation = account.donations.id(req.params.id)
        var updatedInfo = req.body;

        // date fixing code
        if (req.body.fallback) {
            updatedInfo.date = new Date(req.body.day + ' ' + req.body.month + ', ' + req.body.year);
        }

        editedDonation.set(updatedInfo)
            .catch(err => console.log(err))
        editedDonation.markModified('date')
            .catch(err => console.log(err))

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

        let response = await account.save().catch(err => console.log(err))
        res.redirect(`/accounts/${account.slug}`);
    })

    // resourceful destroy
    app.delete('/accounts/:slug/transactions/:id', async (req, res) => {
        let query = {
            slug: req.params.slug
        }
        let account = await database.account.findOne(query)
            .catch(err => console.log(err))
        account.donations.id(req.params.id).remove()
            .catch(err => console.log(err))
        let response = await account.save().catch(err => console.log(err))
        res.redirect(`/accounts/${account.slug}`)
    })

}
