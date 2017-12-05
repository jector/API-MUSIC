'use strict'

var express = require('express');
var SongControllers = require('../controllers/song');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/songs'});

api.get('/song-controller/:id', md_auth.ensureAuth, SongControllers.getSong);
api.post('/song-controller', md_auth.ensureAuth, SongControllers.saveSong);
api.get('/songs-controller/:album?', md_auth.ensureAuth, SongControllers.getSongs);
api.put('/song-controller/:id', md_auth.ensureAuth, SongControllers.updateSong);
api.delete('/song-controller/:id', md_auth.ensureAuth, SongControllers.deleteSong);
api.post('/upload-song/:id',[md_auth.ensureAuth, md_upload], SongControllers.uploadSongFile);
api.get('/get-song/:songFile', SongControllers.getSongFile);

module.exports = api;