'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    nombre: String,
    apellido: String,
    usuario: String,
    email: String,
    password: String,
    image: String,
    
});

module.exports = mongoose.model('User', UserSchema);