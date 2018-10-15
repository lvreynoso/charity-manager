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
import slug from 'slugify'
import axios from 'axios'

// controllers
import index from './controllers/index.js'
import admin from './controllers/admin.js'
import accounts from './controllers/accounts.js'
import transactions from './controllers/transactions.js'
import charities from './controllers/charities.js'

// models
import Account from './models/account.js'
import User from './models/user.js'
import Charity from './models/charity.js'

// library
import CharityNavigator from './api/charity-navigator.js'
let charityNav = new CharityNavigator(process.env.CHARITY_NAV_APP_ID,
    process.env.CHARITY_NAV_API_KEY, process.env.CHARITY_NAV_BASE_URL)

// handlebars helpers
import exphbsConfig from './views/config/exphbs-config.js'
let exphbs = handlebars.create(exphbsConfig);

// set our express options
let app = express();
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.engine('handlebars', exphbs.engine);
app.set('view engine', 'handlebars');
app.use(express.static('public'));

// clunky HTTP method fix
app.use(methodOverride('_method'))

// connect to our database
let mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/charity-manager'
mongoose.connect(mongoUri, {
    useNewUrlParser: true
});

// inject those dependencies
let database = {
    user: User,
    account: Account,
    charity: Charity,
}

let modules = {
    slug: slug,
    axios: axios,
    charityNavigator: charityNav
}

// face the world
const hotPort = app.get('port')
let server = app.listen(hotPort, () => {
    console.log(`App listening on port ${hotPort}!`)
})

// stick the needle in
index(app, database, modules);
admin(app, database, modules);
transactions(app, database, modules);
accounts(app, database, modules);
charities(app, database, modules);

// for Mocha/Chai test purposes
export default server;
