'use strict'

// dependencies
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';

// controllers
import index from './controllers/index.js'
import admin from './controllers/admin.js'
import portfolio from './controllers/portfolio.js'
import dashboard from './controllers/dashboard.js'

// models
import User from './models/user.js'
import Account from './models/account.js'
import Charity from './models/charity.js'

// set our express options
let app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.engine('handlebars', handlebars({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// connect to our database
mongoose.connect('mongodb://localhost/charity-manager', {
    useNewUrlParser: true
});

// inject those dependencies
var database = {
    user: User,
    account: Account,
    charity: Charity,
}

// face the world
var server = app.listen(3000, () => {
    console.log('App listening on port 3000!')
})

// stick the needle in
index(app, database);
admin(app, database);
portfolio(app, database);
dashboard(app, database);

// for Mocha/Chai test purposes
export { server };
