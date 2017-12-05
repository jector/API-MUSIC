'use strict'

var path = require('path');
var fs = require('fs');

var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getAlbum(req, res){

	var albumId = req.params.id;

	Album.findById(albumId).populate({path : 'artist'}).exec((err, album) => {
		if(err){
			res.status(500).send({message : 'Error in the request'});
		}else{
			if(!album){
				res.status(400).send({message : 'There are not album!!'});
			}else{
				res.status(200).send({album});
			}
		}
	});
}

function getAlbums(req,res){

	var artisId = req.params.artist;

	if(!artisId){
		// Get out every albums from DB
		var find = Album.find({}).sort('title');
	}else{
		// Get out the albums of the unic artist from DB
		var find = Album.find({artist : artisId}).sort('year');
	}
	find.populate({path : 'artist'}).exec((err, albums) => {
		if(err){
			res.status(500).send({message : 'Error in the request'});
		}else{
			if(!albums){
				res.status(400).send({message : 'There are not albums!!'});
			}else{
				res.status(200).send({albums});
			}
		}
	});
}

function saveAlbum(req,res){

	var album  = new Album();
	var params = req.body;

	album.title = params.title;
	album.description = params.description;
	album.year = params.year;
	album.image = null;
	album.artist = params.artist;

	album.save((err, albumStored) => {
		if(err){
			res.status(500).send({message : 'Error to save album'});
		}else{
			if(!albumStored){
				res.status(404).send({message : 'The artist is not save'});
			}else{
				res.status(200).send({album : albumStored});
			}
		}
	});

}

function updateAlbum(req,res){
	var albumId = req.params.id;
	var update = req.body;

	Album.findByIdAndUpdate(albumId, update, (err,albumUpdated) => {
		if(err){
			res.status(500).send({message : 'Error to update album'});
		}else{
			if(!albumUpdated){
				res.status(404).send({message : 'The album is not updated'});
			}else{
				res.status(404).send({album : albumUpdated});
			}
		}
	});
}

function deleteAlbum(req,res) {
	var albumId = req.params.id;

	Album.findByIdAndRemove(albumId, (err,albumRemoved) => {
		if(err){
			res.status(500).send({message : 'Error to remove album'});
		}else{
			if(!albumRemoved){
				res.status(404).send({message : 'The album is not removed'});
			}else{


				Song.find({album : albumRemoved.id}).remove((err,songRemoved) => {

					if(err){
						res.status(500).send({message : 'Error to remove song'});
					}else{
						if(!songRemoved){
							res.status(404).send({message : 'The song is not removed'});
						}else{
							res.status(200).send({album : albumRemoved});
						}
					}
				});
							
			
			}
		}
	});
}

function uploadImage(req, res){
	var albumId = req.params.id;
	var filename = 'No upload..';

	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('/');
		var file_name = file_split[2];

		var ext_split = file_name.split('.');
		var file_ext = ext_split[1];

		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){

			Album.findByIdAndUpdate(albumId, {image: file_name}, (err, updloadAlbumImg) => {
				if(!updloadAlbumImg){
					res.status(404).send({message: 'Album can not update image'});
				}else{
					res.status(200).send({album: updloadAlbumImg});
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
	var pathFile = './uploads/albums/' + imageFile;

	fs.exists(pathFile, (exists) => {

		if(true){
			res.sendFile(path.resolve(pathFile));
		}else{
			res.status(404).send({message: 'Image not exists ...'});
		}
	});
}


module.exports = {
	getAlbum,
	getAlbums,
	saveAlbum,
	updateAlbum,
	deleteAlbum,
	uploadImage,
	getImageFile
}