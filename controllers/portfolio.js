// portfolio.js
// top priority: minimum viable product page

export default function(app, database) {
    app.get('/portfolio', (req, res) => {
        res.render('portfolio-show');
    })
}
