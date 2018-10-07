'use strict'

// environment setup
import dotenv from 'dotenv'
const result = (process.env.NODE_ENV == 'development') ? dotenv.config() : false

// dependencies
import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import handlebars from 'express-handlebars'
import path from 'path'
import methodOverride from 'method-override'

// controllers
import index from './controllers/index.js'
import admin from './controllers/admin.js'
import accounts from './controllers/accounts.js'
import transactions from './controllers/transactions.js'
import dashboard from './controllers/dashboard.js'

// models
import Account from './models/account.js'
import Charity from './models/charity.js'
import User from './models/user.js'

// set our express options
let app = express();
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.engine('handlebars', handlebars({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// clunky HTTP method fix
app.use(methodOverride('_method'))

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
const hotPort = app.get('port')
var server = app.listen(hotPort, () => {
    console.log(`App listening on port ${hotPort}!`)
})

// stick the needle in
index(app, database);
admin(app, database);
transactions(app, database);
dashboard(app, database);
accounts(app, database)

// for Mocha/Chai test purposes
export default server;
