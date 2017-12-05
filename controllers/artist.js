'use strict'

var path = require('path');
var fs = require('fs');

var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req, res){

	var artistId = req.params.id;
	Artist.findById(artistId, (err, artist) => {
		if(err) {
			res.status(500).send({message : 'Error in the request'});
		}else{
			if (!artist){
				res.status(400).send({message : 'Artist not exist'});
			}else{
				res.status(200).send({artist});
			}
		}
	});
}

function getArtists(req,res){

	if(req.params.page){
		var page = req.params.page;
	}else{
		var page = 1;
	}

	var itemsPerPage = 3;

	Artist.find().sort('name').paginate(page, itemsPerPage, (err, artists, total) => {
		if(err){
			res.status(500).send({message : 'Error in the request'});
		}else{
			if(!artists){
				res.status(400).send({message : 'There are not artists!!'});
			}else{
				return res.status(200).send({
					total_items: total,
					artists: artists
				});
			}
		}
	});


}

function saveArtist(req,res){
	var artist = new Artist();
	var params = req.body;

	artist.name = params.name;
	artist.description = params.description;
	artist.image = null;

	artist.save((err, artistStored) => {

		if(err){
			res.status(500).send({message : 'Error to save artist'});
		}else{
			if(!artistStored){
				res.status(404).send({message : 'The artist is not save'});
			}else{
				res.status(200).send({artist : artistStored});
			}
		}
	});
}

function updateArtist(req,res){
	var artistId = req.params.id;
	var update = req.body;

	Artist.findByIdAndUpdate(artistId, update, (err,artistUpdated) => {
		if(err){
			res.status(500).send({message : 'Error to update artist'});
		}else{
			if(!artistUpdated){
				res.status(404).send({message : 'The artist is not updated'});
			}else{
				res.status(404).send({artist : artistUpdated});
			}
		}
	});
}

function deleteArtist(req,res) {
	var artistId = req.params.id;

	Artist.findByIdAndRemove(artistId, (err,artistRemoved) => {
		if(err){
			res.status(500).send({message : 'Error to remove artist'});
		}else{
			if(!artistRemoved){
				res.status(404).send({message : 'The artist is not removed'});
			}else{

				Album.find({artist : artistRemoved.id}).remove((err,albumRemoved) => {
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
										res.status(200).send({artist: artistRemoved});
									}
								}
							});
						}
					}
				});
			}
		}
	});
}

function uploadImage(req, res){
	var artistId = req.params.id;
	var filename = 'No upload..';

	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('/');
		var file_name = file_split[2];

		var ext_split = file_name.split('.');
		var file_ext = ext_split[1];

		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){

			Artist.findByIdAndUpdate(artistId, {image: file_name}, (err, updateArtistImg) => {
				if(!updateArtistImg){
					res.status(404).send({message: 'Artist can not update image'});
				}else{
					res.status(200).send({artist: updateArtistImg});
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
	var pathFile = './uploads/artists/' + imageFile;

	fs.exists(pathFile, (exists) => {

		if(true){
			res.sendFile(path.resolve(pathFile));
		}else{
			res.status(404).send({message: 'Image not exists ...'});
		}
	});
}






module.exports = {
	getArtist,
	saveArtist,
	getArtists,
	updateArtist,
	deleteArtist,
	uploadImage,
	getImageFile
}