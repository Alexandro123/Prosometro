'use strict'

var express = require('express');
var contactosController = require('../controllers/contactosController');
var md_auth = require('../middlewares/autheticated');

'use strict'

var express = require('express');
var ContactoController = require('../controllers/contactosController');
var md_auth = require('../middlewares/autheticated');


var multiparty = require('connect-multiparty');
var md_subir = multiparty({ uploadDir: './src/uploads/users' })


//Rutas
var api = express.Router();
api.post('/addContact', md_auth.ensureAuth, ContactoController.addContacto);
api.post('/subir-imagen-contacto/:id', [md_auth.ensureAuth, md_subir], ContactoController.subirImagen);
api.get('/obtener-imagen-contacto/:nombreImagen', ContactoController.obtenerImagen)
api.put('/editar-contacto/:id', md_auth.ensureAuth, ContactoController.editarContacto)
api.delete('/eliminar-contacto/:id', md_auth.ensureAuth, ContactoController.eliminarContacto)
api.get('/contacto/:id', ContactoController.getContacto)
api.get('/contactos', md_auth.ensureAuth, ContactoController.getContactos)

module.exports = api;