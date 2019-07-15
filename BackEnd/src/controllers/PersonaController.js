'use strict'

var Persona = require('../models/persona');
var Partido = require('../models/partidoPolitico');
var fs = require('fs');
var path = require('path');

function addPersona(req, res) {
    var persona = new Persona();
    var body = req.body;
    if (body.name && body.puesto && body.partido) {
        persona.name = body.name;
        persona.image = null;
        persona.puesto = body.puesto;

        persona.paraBuscar = '1'

        Partido.findOne({ name: body.partido }).exec((err, encontrado) => {
            if (err) res.status(500).send({ message: 'Persona controller 20' });
            if (encontrado) {
                //return res.status(200).send({ encontrado });
                console.log(encontrado)
                persona.partido = encontrado._id;

                Persona.find({ name: body.name }).exec((err, personas) => {
                    if (err) res.status(500).send({ message: 'error en la peticion de personas' });

                    if (personas && personas.length >= 1) {
                        return res.status(200).send({ message: 'la persona ya existe' })
                    } else {
                        persona.save((err, personaStored) => {
                            if (err) return res.status(500).send({ message: 'error al guardar a la persona', err });

                            if (personaStored) {
                                res.status(200).send({ persona: personaStored });
                            } else {
                                res.status(404).send({ message: 'no se ha registrado la persona' });
                            }
                        })
                    }
                })
            } else {
                return res.status(500).send({ message: 'No existe ese partido' })
            }
        })

    } else {
        res.status(200).send({ message: 'ingrese todos los campos: name, puesto, partido' })
    }
}

function deletePersona(req, res) {
    var personaId = req.params.id;
    var body = req.body;

    Persona.findByIdAndDelete(personaId, (err, borrado) => {
        if (err) res.status(500).send({ message: 'error al borrar persona' })

        if (!borrado) res.status(404).send({ message: 'no se ha podido borrar a la persona' })

        return res.status(200).send({ Persona: borrado })
    })
}

function getPersonas(req, res) {
    Persona.find({ paraBuscar: '1' }, (err, encontrados) => {
        if (err) return res.status(500).send({ message: 'error en la peticion', err });

        if (encontrados.length >= 1) {
            return res.status(200).send({ persona: encontrados });
        } else {
            return res.status(500).send({ message: 'No hay ninguna persona' })
        }
    });
}

function getPersona(req, res) {
    var personaId = req.params.id;

    Persona.findById(personaId, (err, encontrado) => {
        if (err) return res.status(500).send({ message: 'error en la peticion' });

        if (encontrado) {
            return res.status(200).send({ persona: encontrado });
        } else {
            return res.status(500).send({ message: 'No existe esa persona' })
        }
    })
}

function getPesonasPorPartido(req, res) {
    var partidoNombre = req.body.partido

    Partido.findOne({ name: partidoNombre }, (err, encontrado) => {
        if (err) return res.status(500).send({ message: 'error en la peticion', err });

        if (encontrado) {
            Persona.find({ partido: encontrado._id }, (err, encontrados) => {

                if (err) return res.status(500).send({ message: 'error en la peticion', err });
        
                if (encontrados.length >= 1) {
                    return res.status(200).send({ persona: encontrados });
                } else {
                    return res.status(500).send({ message: 'No hay ninguna persona' })
                }
            })
        } else {
            return res.status(500).send({ message: 'Ese partido no existe' })
        }
    })

    
}

function editPersona(req, res) {
    var personaId = req.params.id;
    var body = req.body;

    Persona.findByIdAndUpdate(personaId, body, { new: true }, (err, actualizado) => {
        console.log(actualizado)
        if (err) return res.status(500).send({ message: 'error en la peticion' });

        if (!actualizado) return res.status(404).send({ message: 'no se a podido actualizar los datos de la persona' })

        return res.status(200).send({ persona: actualizado });
    })
}

function uploadImage(req, res) {
    var personaId = req.params.id;
    console.log(req.body.id)

    if (req.files) {

        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[3];

        var ext_split = file_name.split('\.')
        var file_ext = ext_split[1];
         

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            //actualizar al partido 
            console.log(personaId)
            Persona.findByIdAndUpdate(personaId, { image: file_name }, { new: true }, (err, actualizado) => {
                if (err) return res.status(500).send({ message: 'error en la peticion' });

                if (!actualizado) return res.status(404).send({ message: 'no se a podido actualizar los datos de la persona' })

                return res.status(200).send({ persona: actualizado });
            })
        } else {
            return removeFilesOfUploads(res, file_path, 'archivo no valido');
        }

    } else {
        return res.status(200).send({ message: 'no se ha subido ninguna imagen' })
    }
}

function removeFilesOfUploads(res, file_path, message2) {
    fs.unlink(file_path, (err) => {
        return res.status(200).send({ message: message2 })
    })
}



module.exports = {
    addPersona,
    deletePersona,
    editPersona,
    getPersona,
    getPersonas,
    getPesonasPorPartido,
    uploadImage
}