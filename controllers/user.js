'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');


function test(req, res) {
	res.status(200).send({
		message : 'Tested an action of user controller with Mongo and Node'
	});
}

// New user
function saveUser(req, res){
	var user = new User();
	var params = req.body;

	console.log(params);

	user.name = params.name;
	user.surname = params.name;
	user.email = params.email;
	user.role = 'ROLE_USER';
	user.image = null;

	if(params.password){
		// Encrypt password and save dates
		bcrypt.hash(params.password, null, null, function(err, hash){
			user.password = hash;
			if(user.name != null && user.surname != null && user.email != null){
				// Save user
				user.save((err, userStored) => {
					if(err){
						res.status(500).send({message: 'Error when saving the user'});
					}else{
						if(!userStored){
							res.status(404).send({message: 'Unregistered user'});
						}else {
							res.status(200).send({user : userStored});
						}
					}
				});
			}else{
				res.status(200).send({message: 'Fill in all the fields'});
			}
		});
	}else{
		res.status(200).send({message: 'Enter the password'});
	}
}

// User login
function loginUser(req, res){
	var params = req.body;

	var email = params.email;
	var password = params.password;

	User.findOne({email : email.toLowerCase()}, (err, user) => {
		if(err){
			res.status(500).send({message: 'Error in the request'});
		}else {
			if(!user){
				res.status(404).send({message: 'User name dosen,t exist'});
			}else{
				//Check password
				bcrypt.compare(password, user.password, (err, check) => {
					if(check){
						//Returns data form user login
						if(params.gethash){
							// Return token of jwt
							res.status(200).send({
								token : jwt.createToken(user)
							});


						}else{
							res.status(200).send({user});
						}
					}else {
						res.status(404).send({message: 'User can not logged'});
					}

				});
			}
		}
	});

}

//Update user
function updateUser(req, res){
	var userId = req.params.id;
	var update = req.body;

	User.findByIdAndUpdate(userId, update, (err, updateUser) => {
		if(err){
			res.status(500).send({message: 'Error user update'});
		}else{
			if(!updateUser){
				res.status(404).send({message: 'User can not update'});
			}else{
				res.status(200).send({user: updateUser});
			}
		}
	});
}

//Upload user image
function uploadImage(req, res){
	var userId = req.params.id;
	var filename = 'No upload..';

	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('/');
		var file_name = file_split[2];

		var ext_split = file_name.split('.');
		var file_ext = ext_split[1];

		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){

			User.findByIdAndUpdate(userId, {image: file_name}, (err, updateUser) => {
				if(!updateUser){
					res.status(404).send({message: 'User can not update image'});
				}else{
					res.status(200).send({
						image: file_name, 
						user: updateUser
					});
				}
			});

		}else{
			res.status(404).send({message: 'Not is a correct extension'});
		}

		console.log(ext_split);
	}else{
		res.status(404).send({message: 'Image not Upload'});
	}

}


function getImageFile(req, res){
	var imageFile = req.params.imageFile;
	var pathFile = './uploads/users/' + imageFile;

	fs.exists(pathFile, (exists) => {

		if(true){
			res.sendFile(path.resolve(pathFile));
		}else{
			res.status(404).send({message: 'Image not exists ...'});
		}
	});
}





module.exports = {
	test,
	saveUser,
	loginUser,
	updateUser,
	uploadImage,
	getImageFile
};

