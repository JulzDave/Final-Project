var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session') 

const mongoose = require('mongoose');


var app = express();

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }))
  
// Connect locally via: ' mongodb://localhost/JB-Market '
mongoose.connect('mongodb+srv://julian:awdawd@jb-brunch-yz2u4.mongodb.net/JB-Market?retryWrites=true', {useNewUrlParser: true, useCreateIndex:true});

var api = require('./routes/API');
var shoppingRouter = require('./routes/shopping');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

app.use('/shopping', shoppingRouter);
app.use('/api', api);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

module.exports = app;
