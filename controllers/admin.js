// admin.js

export default function(app, database, modules) {
    app.get('/admin', (req, res) => {
        // scour the database
        database.account.find().then(accounts => {
            // render the page
            res.render('admin', { accounts: accounts })
        }).catch(err => {
            console.log(err.message)
            res.render('admin')
        })
    })
}
