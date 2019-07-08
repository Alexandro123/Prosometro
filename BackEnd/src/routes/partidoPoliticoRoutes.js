'use strict'

var express = require('express');
var PartidoPolitico = require('../controllers/partidoPoliticoController');

var api = express.Router();
var md_auth = require('../middlewares/autheticated');

//api.post('/addPartidoPolitico', md_auth.ensureAuth, PartidoPolitico.addPartidoPolitico);
api.post('/addPartidoPolitico', PartidoPolitico.addPartidoPolitico);
//api.post('/editPartidos', md_auth.ensureAuth,PartidoPolitico.editPartidos);
api.put('/editPartido/:id', PartidoPolitico.editPartido);
api.get('/getPartidos', PartidoPolitico.getPartidos);

module.exports = api;