var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session') 

var mongoose = require('mongoose');


var app = express();

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }))
  

mongoose.connect('mongodb://localhost/JB-Market', {useNewUrlParser: true, useCreateIndex:true});

var api = require('./routes/API');
var shoppingRouter = require('./routes/shopping');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/shopping', shoppingRouter);
app.use('/api', api);
module.exports = app;
