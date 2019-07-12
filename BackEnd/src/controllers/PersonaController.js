'use strict'

var Persona = require('../models/persona');
var fs = require('fs');
var path = require('path');

function addPersona(req, res){
    var persona = new Persona();
    var body = req.body;

    if (body.name && body.puesto && body.partido){
        persona.name = body.name;
        persona.image = null;
        persona.puesto = body.puesto;
        persona.partido = body.partido;
        persona.paraBuscar = '1'

        Persona.find({ name: body.name }).exec((err, personas) => {
            if (err) res.status(500).send({ message: 'error en la peticion de personas' });

            if (personas && personas.length >= 1) {
                return res.status(200).send({ message: 'la persona ya existe' })
            } else {
                personas.save((err, personaStored) => {
                    if (err) return res.status(500).send({ message: 'error al guardar a la persona' });

                    if (personaStored) {
                        res.status(200).send({ persona: personaStored });
                    } else {
                        res.status(404).send({ message: 'no se ha registrado la persona' });
                    }
                })
            }
        })
    }else{
        res.status(200).send({message: 'ingrese todos los campos: name, puesto, partido'})
    }

    function deletePersona(req, res){
        var personaId = req.params.id;
        var body = req.body;
        
        Persona.findByIdAndDelete(personaId, (err, borrado) => {
            if (err) res.status(500).send({message: 'error al borrar persona'})

            if (!borrado) res.status(404).send({message: 'no se ha podido borrar a la persona'})

            return res.status(200).send({Persona: borrado})
        })
    }

    function getPersonas(req, res){
        Persona.find({ paraBuscar: '1' }, (err, encontrados) => {
            if (err) return res.status(500).send({ message: 'error en la peticion', err });
    
            if (encontrados.length >= 1) {
                return res.status(200).send({ persona: encontrados });
            } else {
                return res.status(500).send({ message: 'No hay ningun partido politico' })
            }
        });
    }

    function getPersona(req, res) {
        var personaId = req.body.id;
    
        PartidoPolitico.findById(partidoId, (err, encontrado) => {
            if (err) return res.status(500).send({ message: 'error en la peticion' });
    
            if (encontrado.length >= 1) {
                return res.status(200).send({ partidoPolitico: encontrado });
            } else {
                return res.status(500).send({ message: 'No existe ese partido politico' })
            }
        })
    }

}

module.exports = {

}