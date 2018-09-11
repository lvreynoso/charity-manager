'use strict'

import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';

let app = express();

app.use(bodyParser.json());
app.engine('handlebars', handlebars({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({
    extended: true
}));

var server = app.listen(3000, () => {
    console.log('App listening on port 3000!')
})

module.exports = server;
