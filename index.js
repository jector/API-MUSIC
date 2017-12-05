'use strict'

// Conection with Data Base Mongo
var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/mean2', (err, res) => {
	if(err){
		throw err;
	}else{
		console.log('  -> Data Base conection is succesful ...');

		app.listen(port, () => {
			console.log('  -> API REST MUSIC Service listen in the port http://localhost:' + port);
		});
	}
});