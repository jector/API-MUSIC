'use strict'

var express = require('express');
var ArtistControllers = require('../controllers/artist');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/artists'});

api.get('/artist-controller/:id', md_auth.ensureAuth, ArtistControllers.getArtist);
api.post('/artist-controller', md_auth.ensureAuth, ArtistControllers.saveArtist);
api.get('/artists-controller/:page?', md_auth.ensureAuth, ArtistControllers.getArtists);
api.put('/artist-controller/:id', md_auth.ensureAuth, ArtistControllers.updateArtist);
api.delete('/artist-controller/:id', md_auth.ensureAuth, ArtistControllers.deleteArtist);
api.post('/upload-image-artist/:id',[md_auth.ensureAuth, md_upload],  ArtistControllers.uploadImage);
api.get('/get-image-artist/:imageFile', ArtistControllers.getImageFile);

module.exports = api;