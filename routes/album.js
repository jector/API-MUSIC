'use strict'

var express = require('express');
var AlbumControllers = require('../controllers/album');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/albums'});

api.get('/album-controller/:id', md_auth.ensureAuth, AlbumControllers.getAlbum);
api.post('/album-controller', md_auth.ensureAuth, AlbumControllers.saveAlbum);
api.get('/albums-controller/:artist?', md_auth.ensureAuth, AlbumControllers.getAlbums);
api.put('/album-controller/:id', md_auth.ensureAuth, AlbumControllers.updateAlbum);
api.delete('/album-controller/:id', md_auth.ensureAuth, AlbumControllers.deleteAlbum);
api.post('/upload-image-album/:id',[md_auth.ensureAuth, md_upload], AlbumControllers.uploadImage);
api.get('/get-image-album/:imageFile', AlbumControllers.getImageFile);

module.exports = api;