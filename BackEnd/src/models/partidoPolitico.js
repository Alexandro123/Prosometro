'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PartidoPoliticoSchema = Schema({
    name: String,
    image: String,
    descripcion: String,
    paraBuscar: String
});

module.exports = mongoose.model('PartidoPolitico', PartidoPoliticoSchema);