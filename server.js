'use strict'

// dependencies
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';

// controllers
import index from './controllers/index.js'
import statics from './controllers/statics.js'

// models
import User from './models/user.js'
import Account from './models/account.js'
import Charity from './models/charity.js'

let app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.engine('handlebars', handlebars({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

mongoose.connect('mongodb://localhost/charity-manager', {
    useNewUrlParser: true
});

var database = {
    user: User,
    account: Account,
    charity: Charity,
}

var server = app.listen(3000, () => {
    console.log('App listening on port 3000!')
})

index(app, database);
statics(app, database);

module.exports = server;
