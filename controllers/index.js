// index.js
// for our landing page

export default function(app, database, modules) {
    app.get('/', (req, res) => {
        res.render('index');
    })
}
