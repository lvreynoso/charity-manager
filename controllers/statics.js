// static.js
// for our static pages

export default function(app, database) {
    app.get('/admin', (req, res) => {
        // scour the database

        // render the page
        res.render('admin');
    })
}
