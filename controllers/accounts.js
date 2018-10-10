// accounts.js

export default function(app, database, modules) {

    // show all accounts async / await style
    app.get('/accounts', async (req, res) => {
        let accounts = await database.account.find().catch(err => console.log(err))
        res.render('accounts', {
            accounts: accounts
        })
    })

    // get new account form
    app.get('/accounts/new', (req, res) => {
        res.render('accounts-new')
    })

    // async show one account
    app.get('/accounts/:slug', async (req, res) => {
        let query = {
            slug: req.params.slug
        }
        let account = await database.account.findOne(query).populate('charities').catch(err => console.log(err))
        res.render('accounts-show', {
            account: account
        })
    })

    // async edit account information
    app.get('/accounts/:slug/edit', async (req, res) => {
        let query = {
            slug: req.params.slug
        }
        let account = await database.account.findOne(query).catch(err => console.log(err))
        res.render('accounts-edit', {
            account: account
        })
    })

    // async update account information
    app.put('/accounts/:slug', async (req, res) => {
        // turn req.body into an object that conforms to our model
        let transformedEntry = {
            name: {}
        }
        transformedEntry.name = {
            first: req.body.firstName,
            last: req.body.lastName
        }
        // get the account
        let query = {
            _id: req.body.mongoId
        }
        let account = await database.account.findOne(query).catch(err => console.log(err))
        account.set(transformedEntry)

        // create a new slug for the updated account
        let mongoId = `${account._id}`.substring(`${account._id}`.length - 4)
        account.slug = modules.slug(account.name.full + ' ' + mongoId)
        // save the account to our db
        let updatedAccount = await account.save().catch(err => console.log(err))

        res.redirect(`/accounts/${account.slug}`)
    })

    // async create account
    app.post('/accounts', async (req, res) => {
        // turn req.body into an object that conforms to our model
        var transformedEntry = {
            name: {}
        }
        transformedEntry.name = {
            first: req.body.firstName,
            last: req.body.lastName
        }
        // create the account
        let account = await database.account.create(transformedEntry).catch(err => console.log(err))
        // create a slug for the account
        let mongoId = `${account._id}`.substring(`${account._id}`.length - 4)
        account.slug = modules.slug(account.name.full + ' ' + mongoId)
        let result = await account.save().catch(err => console.log(err))

        res.redirect(`/accounts`)
    })

    app.delete('/accounts/:id', async (req, res) => {
        var query = {
            _id: req.params.id
        }
        let result = await database.account.findOneAndDelete(query).catch(err => console.log(err))
        res.redirect(`/accounts`)
    })
}
