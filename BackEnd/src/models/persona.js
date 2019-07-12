'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PersonaSchema = Schema({
    name: String,
    image: String,
    puesto: String,
    //partido: { type: Schema.ObjectId, ref: 'PartidoPolitico' },
    partido: { type: Schema.name, ref: 'PartidoPolitico' },
    paraBuscar: String
});

module.exports = mongoose.model('Persona', PersonaSchema);