// index.js
// for our landing page

export default function(app, database) {
    app.get('/', (req, res) => {
        res.render('index');
    })
}
