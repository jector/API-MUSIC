// Server with express.js
'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//Configuration routes

var user_router = require('./routes/user');
var artist_router = require('./routes/artist');
var album_router = require('./routes/album');
var song_router = require('./routes/song');


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Configuration Heads http

app.use((req,res,next) => {
	res.header('Access-Control-Alow-Origin', '*');
	res.header('Access-Control-Alow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Alow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

	next();
});

//Base Routes

app.use('/api', user_router);
app.use('/api', artist_router);
app.use('/api', album_router);
app.use('/api', song_router);


module.exports = app;