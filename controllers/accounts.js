// accounts.js

export default function(app, database) {
    app.post('/accounts', (req, res) => {
        console.log(req.body);
        var transformedEntry = { name: {} }
        transformedEntry.name = { first: req.body.firstName, last: req.body.lastName}
        console.log(transformedEntry);
        database.account.create(transformedEntry).then(account => {
            res.redirect('/admin')
        }).catch(err => {
            console.log(err.message);
        })
    })
}
