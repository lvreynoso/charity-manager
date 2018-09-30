// dashboard.js
// bottom priority

export default function(app, database) {
    app.get('/dashboard', (req, res) => {
        res.render('dashboard');
    })
}
