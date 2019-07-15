'use strict'

var bcrypt = require('bcrypt-nodejs');
var Promesa = require('../models/promesa');
var jwt = require('../services/jwt');
var path = require('path');
var fs = require('fs');

var Persona = require('../models/persona')

function addPromesa(req, res) {
    var promesa = new Promesa();
    var body = req.body;
    if (body.title && body.descripcion && body.hechoPor) {
        promesa.title = body.title;
        promesa.descripcion = body.descripcion;
        promesa.hechoPor = body.hechoPor;
        promesa.paraBuscar = '1'
        promesa.votos = {
            si: 0,
            no: 0
        };
        promesa.aprobacion = 0;
        promesa.yaVotaron = []
        console.log('1')
        Persona.findOne({ name: body.hechoPor }).exec((err, personaEncontrada) => {
        //Partido.findOne({ name: body.partido }).exec((err, encontrado) => {
            if (err) res.status(500).send({ message: 'error al crear la promesa' });
            console.log('2')
            if (personaEncontrada) {
                console.log('3');
                console.log(personaEncontrada);
                console.log(personaEncontrada._id);
                promesa.hechoPor = personaEncontrada._id;

                Promesa.find({ title: body.title }).exec((err, promesaEncontrada) => {
                    if (err) res.status(500).send({ message: 'error en la peticion de promesa' });
                    console.log('4')
                    if (promesaEncontrada && promesaEncontrada.length >= 1) {
                        return res.status(200).send({ message: 'la promesa ya existe' })
                    } else {
                        console.log(promesa)
                        promesa.save((err, promesaStored) => {
                            if (err) return res.status(500).send({ message: 'error al guardar la promesa', err });

                            if (promesaStored) {
                                res.status(200).send({ promesa: promesaStored });
                            } else {
                                res.status(404).send({ message: 'no se ha registrado la promesa' });
                            }
                        })
                    }
                })
            } else {
                res.status(500).send({ message: 'esa persona no existe' });
            }
        })

    } else {
        res.status(200).send({ message: 'ingrese todos los campos: title, descripcion, hechoPor' })
    }
}

function deletePromesa(req, res) {
    var promesaId = req.params.id;
    var body = req.body;

    Promesa.findByIdAndDelete(promesaId, (err, borrado) => {
        if (err) res.status(500).send({ message: 'error al borrar promesa' })

        if (!borrado) res.status(404).send({ message: 'no se ha podido borrar a la promesa' })

        return res.status(200).send({ Promesa: borrado })
    })
}

function editPromesa(req, res) {
    var promesaId = req.params.id;
    var body = req.body;

    Promesa.findByIdAndUpdate(promesaId, body, { new: true }, (err, actualizado) => {
        console.log(actualizado)
        if (err) return res.status(500).send({ message: 'error en la peticion' });

        if (!actualizado) return res.status(404).send({ message: 'no se a podido actualizar los datos de la promesa' })

        return res.status(200).send({ promesa: actualizado });
    })
}

function getPromesas(req, res) {
    Promesa.find({ paraBuscar: '1' }, (err, encontrados) => {
        if (err) return res.status(500).send({ message: 'error en la peticion', err });

        if (encontrados.length >= 1) {
            return res.status(200).send({ promesa: encontrados });
        } else {
            return res.status(500).send({ message: 'No hay ninguna promesa' })
        }
    });
}

function getPromesa(req, res) {
    var promesaId = req.params.id;

    Promesa.findById(promesaId, (err, encontrado) => {
        if (err) return res.status(500).send({ message: 'error en la peticion' });

        if (encontrado) {
            return res.status(200).send({ promesa: encontrado });
        } else {
            return res.status(500).send({ message: 'No existe esa promesa' })
        }
    })
}

function getPromesaPorPersona(req, res) {
    var personaNombre = req.body.persona;

    Persona.findOne({ name: personaNombre }, (err, encontrado) => {
        if (err) return res.status(500).send({ message: 'error en la peticion', err });

        if (encontrado) {
            Promesa.findO({ hechoPor: encontrado.name }, (err, encontrados) => {
                if (err) return res.status(500).send({ message: 'error en la peticion', err });

                if (encontrados.length >= 1) {
                    return res.status(200).send({ promesa: encontrados });
                } else {
                    return res.status(500).send({ message: 'No hay ninguna promesa' })
                }
            })
            /*Persona.find({ partido: encontrado._id }, (err, encontrados) => {

                if (err) return res.status(500).send({ message: 'error en la peticion', err });
        
                if (encontrados.length >= 1) {
                    return res.status(200).send({ persona: encontrados });
                } else {
                    return res.status(500).send({ message: 'No hay ninguna persona' })
                }
            })*/
        } else {
            return res.status(500).send({ message: 'Esa promesa no existe' })
        }
    })

}

function darOpinion(req, res) {
    var body = req.body;
    var opinion = body.opinion.toLowerCase();
    var promesaId = req.params.id;
    //email, opinion, id
    var yaOpino = false;
    var votoFinal = 'votos.' + opinion

    if (opinion === "si" || opinion === "no") {
        Promesa.findById(promesaId, (err, encontrado) => {
            if (err) return res.status(500).send({ message: 'error en la peticion (107)' });

            if (!encontrado) return res.status(500).send({ message: "error al listar la promesa" });

            for (let x = 0; x < encontrado.yaVotaron.length; x++) {
                if (encontrado.yaVotaron[x] === body.email) {
                    yaOpino = true;
                    return res.status(500).send({ message: "el usuario ya opino en esta encuesta" })
                }
            }

            if (yaOpino === false) {
                Promesa.findByIdAndUpdate(promesaId, { $inc: { [votoFinal]: 1 } }, { new: true }, (err, actualizado) => {
                    if (err) return res.status(404).send({ message: "error promesaController linea 122" })
                    if (!actualizado) return res.status(500).send({ message: "error al opinar en la promesa" })
                    //actualizado.opinion.usuariosO.push(req.user.sub);
                    //actualizado.save();
                    actualizado.aprobacion = actualizado.votos.si / (actualizado.votos.si + actualizado.votos.no);
                    actualizado.yaVotaron.push(body.email);
                    actualizado.save();
                    return res.status(200).send({ promesa: actualizado })
                })

                /*Promesa.findById(promesaId, (err, encontrado) => {
                    if (err) return res.status(500).send({ message: 'error en la peticion (131)' });

                    if (!encontrado) return res.status(500).send({ message: "error al listar la promesa" });

                    encontrado.aprobacion = 
                })*/
            }
        })
    } else {
        return res.status(500).send({ message: 'solo puede utilizar si y no' })
    }

}


module.exports = {
    addPromesa,
    deletePromesa,
    editPromesa,
    getPromesas,
    getPromesa,
    darOpinion
}