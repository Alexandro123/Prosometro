'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PromesaSchema = Schema({
    title: String,
    descripcion: String,
    hechoPor: { type: Schema.ObjectId, ref: 'Persona' },
    votos:
    {
        si: Number,
        no: Number
    },
    aprobacion: Number,
    yaVotaron: [],
    //partido: { type: Schema.name, ref: 'PartidoPolitico' },
    paraBuscar: String
});

module.exports = mongoose.model('Promesa', PromesaSchema);