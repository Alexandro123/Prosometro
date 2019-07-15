'use strict'

var express = require('express');
var PartidoPolitico = require('../controllers/partidoPoliticoController');

var api = express.Router();
var md_auth = require('../middlewares/autheticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './src/uploads/partidosPoliticos'})

//api.post('/addPartidoPolitico', md_auth.ensureAuth, PartidoPolitico.addPartidoPolitico);
api.post('/addPartidoPolitico', PartidoPolitico.addPartidoPolitico);

//api.post('/uploadImage/:id', [md_auth.ensureAuth, md_upload], PartidoPolitico.uploadImage);
api.post('/uploadImage', md_upload, PartidoPolitico.uploadImage);

//api.put('/editPartidos', md_auth.ensureAuth,PartidoPolitico.editPartidos);
api.put('/editPartido/:id', PartidoPolitico.editPartido);

//api.delete('/deletePartidos/:id', md_auth.ensureAuth, PartidoPolitico.deletePartidos);
api.delete('/deletePartidos/:id', PartidoPolitico.deletePartidos);

api.get('/getPartidos', PartidoPolitico.getPartidos);

api.get('/getPartido/:id', PartidoPolitico.getPartido)

module.exports = api;