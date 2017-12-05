'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'test_secret_world';

exports.ensureAuth = function(req, res, next){
	if(!req.headers.authorization){
		return res.status(403).send({message: 'The request not have the header authentacation'});
	}

	var token = req.headers.authorization.replace( /['"]+/g, '');
	try{
		var payload = jwt.decode(token, secret);

		if(payload.exp <= moment().unix()){
			return res.status(401).send({message: 'The token has expired'});
		}

	}catch(ex){
		//console.log(ex);
		return res.status(404).send({message: 'Token not valid'});
	}

	req.user = payload;

	next(); 

};