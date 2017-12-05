'use strict'

var path = require('path');
var fs = require('fs');

var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getSong(req, res){

	var songId = req.params.id;

	Song.findById(songId).populate({path : 'album'}).exec((err, song) => {
		if(err){
			res.status(500).send({message : 'Error in the request'});
		}else{
			if(!song){
				res.status(400).send({message : 'There are not song!!'});
			}else{
				res.status(200).send({song});
			}
		}
	});
}

function getSongs(req,res){

	var albumId = req.params.album;

	if(!albumId){
		var find = Song.find({}).sort('number');
	}else{
		var find = Song.find({album : albumId}).sort('number');
	}

	find.populate({
		path : 'album',
		populate : {
			path : 'artist',
			model : 'Artist'
		}
	}).exec((err, songs) => {
		if(err){
			res.status(500).send({message : 'Error in the request'});
		}else{
			if(!songs){
				res.status(400).send({message : 'There are not songs!!'});
			}else{
				res.status(200).send({songs});
			}
		}
	});
}



function saveSong(req,res){

	var song  = new Song();
	var params = req.body;

	song.number = params.number;
	song.name = params.name;
	song.duration = params.duration;
	song.file = null;
	song.album = params.album;

	song.save((err, songStored) => {
		if(err){
			res.status(500).send({message : 'Error to save song'});
		}else{
			if(!songStored){
				res.status(404).send({message : 'The artist is not save'});
			}else{
				res.status(200).send({song : songStored});
			}
		}
	});

}

function updateSong(req,res){
	var songId = req.params.id;
	var update = req.body;

	Song.findByIdAndUpdate(songId, update, (err,songUpdated) => {
		if(err){
			res.status(500).send({message : 'Error to update album'});
		}else{
			if(!songUpdated){
				res.status(404).send({message : 'The album is not updated'});
			}else{
				res.status(404).send({song : songUpdated});
			}
		}
	});
}

function deleteSong(req,res) {
	var songId = req.params.id;

	Song.findByIdAndRemove(songId, (err,songRemoved) => {
		if(err){
			res.status(500).send({message : 'Error to remove song'});
		}else{
			if(!songRemoved){
				res.status(404).send({message : 'The song is not removed'});
			}else{
				res.status(200).send({song : songRemoved});
			}
		}
	});
}

function uploadSongFile(req, res){
	var songId = req.params.id;
	var filename = 'No upload..';

	if(req.files){
		var file_path = req.files.file.path;
		var file_split = file_path.split('/');
		var file_name = file_split[2];

		var ext_split = file_name.split('.');
		var file_ext = ext_split[1];

		if(file_ext == 'mp3' || file_ext == 'ogg' || file_ext == 'acc'){

			Song.findByIdAndUpdate(songId, {file: file_name}, (err, updloadSongImg) => {
				if(!updloadSongImg){
					res.status(404).send({message: 'Song can not update file'});
				}else{
					res.status(200).send({album: updloadSongImg});
				}
			});

		}else{
			res.status(404).send({message: 'Not is a correct extension'});
		}

		console.log(ext_split);
	}else{
		res.status(404).send({message: 'File not Upload'});
	}

}

function getSongFile(req, res){
	var songFile = req.params.songFile;
	var pathFile = './uploads/songs/' + songFile;

	fs.exists(pathFile, (exists) => {

		if(true){
			res.sendFile(path.resolve(pathFile));
		}else{
			res.status(404).send({message: 'Song not exists ...'});
		}
	});
}



module.exports = {
	getSong,
	getSongs,
	saveSong,
	updateSong,
	deleteSong,
	uploadSongFile,
	getSongFile
}