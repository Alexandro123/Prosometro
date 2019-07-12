'use strict'

var express = require('express');
var Persona = require('../controllers/PersonaController');

var api = express.Router();
var md_auth = require('../middlewares/autheticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './src/uploads/personas'})

api.post('/addPersona', Persona.addPersona);
api.post('/uploadImagePersona', md_upload, Persona.uploadImage);
api.delete('/deletePersona', Persona.deletePersona);
api.put('/editPersona', Persona.editPersona);
api.get('/getPersona', Persona.getPersona);
api.get('/getPersonas', Persona.getPersonas);
api.get('/getPersonasPorPartido', Persona.getPesonasPorPartido);

module.exports = api;

//api.post('/uploadImage', md_upload, PartidoPolitico.uploadImage);