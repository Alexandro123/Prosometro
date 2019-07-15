'use strict'

var express = require('express');
var Promesa = require('../controllers/promesaController');

var api = express.Router();
var md_auth = require('../middlewares/autheticated');

/*addPromesa,
    deletePromesa,
    editPromesa,
    getPromesas,
    getPromesa,
    darOpinion*/

api.post('/addPromesa', Promesa.addPromesa);
api.delete('/deletePromesa/:id', Promesa.deletePromesa);
api.put('/editPromesa/:id', Promesa.editPromesa);
api.get('/getPromesas', Promesa.getPromesas);
api.get('/getPromesa/:id', Promesa.getPromesa);
api.put('/darOpinion', Promesa.darOpinion);


/*api.post('/addPersona', Persona.addPersona);
api.post('/uploadImagePersona/:id', md_upload, Persona.uploadImage);
api.delete('/deletePersona', Persona.deletePersona);
api.put('/editPersona', Persona.editPersona);
api.get('/getPersona', Persona.getPersona);
api.get('/getPersonas', Persona.getPersonas);
api.get('/getPersonasPorPartido', Persona.getPesonasPorPartido);*/

module.exports = api;