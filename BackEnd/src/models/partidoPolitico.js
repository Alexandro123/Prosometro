'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PartidoPoliticoSchema = Schema({
    name: String,
    image: String,
    paraBuscar: String
});

module.exports = mongoose.model('PartidoPoliticoSchema', PartidoPoliticoSchema);