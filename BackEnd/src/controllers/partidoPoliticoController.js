'use strict'

var PartidoPolitico = require('../models/partidoPolitico');
var path = require('path');
var fs = require('fs');

function addPartidoPolitico(req, res) {
    var partidoPolitico = new PartidoPolitico();
    var body = req.body;

    if (body.name /*&& body.image*/) {
        partidoPolitico.name = body.name;
        //partidoPolitico.image = body.image;
        partidoPolitico.image = null;
        
        if (body.descripcion){
            partidoPolitico.descripcion = body.descripcion;
        }else{
            partidoPolitico.descripcion = '';
        }

        partidoPolitico.paraBuscar = '1';

        PartidoPolitico.find({ name: body.name }).exec((err, partidos) => {
            if (err) res.status(500).send({ message: 'error en la peticion de partidos' });

            if (partidos && partidos.length >= 1) {
                return res.status(200).send({ message: 'El partido ya existe' })
            } else {
                partidoPolitico.save((err, partidoStored) => {
                    if (err) return res.status(500).send({ message: 'error al guardar el usuario' });

                    if (partidoStored) {
                        res.status(200).send({ partidoPolitico: partidoStored });
                    } else {
                        res.status(404).send({ message: 'no se ha registrado el usuario' });
                    }
                })
            }
        })

    } else {
        res.status(200).send({
            message: 'Envie todos los campos necesarios'
        })
    }
}

function deletePartidos(req, res) {
    var partidoId = req.params.id;
    var body = req.body;

    PartidoPolitico.findByIdAndRemove(partidoId, (err, borrado) => {
        if (err) return res.status(500).send({ message: 'error en la peticion' })

        if (!borrado) return res.status(404).send({ message: 'no se a podido borrar al partido' })

        return res.status(200).sen({ partidoPolitico: borrado })
    });
}

function getPartidos(req, res) {
    PartidoPolitico.find({ paraBuscar: '1' }, (err, encontrados) => {
        if (err) return res.status(500).send({ message: 'error en la peticion', err });

        if (encontrados.length >= 1) {
            return res.status(200).send({ partidoPolitico: encontrados });
        } else {
            return res.status(500).send({ message: 'No hay ningun partido politico' })
        }
    });
}

function getPartido(req, res) {
    var partidoId = req.body.id;

    PartidoPolitico.findById(partidoId, (err, encontrado) => {
        if (err) return res.status(500).send({ message: 'error en la peticion' });

        if (encontrado.length >= 1) {
            return res.status(200).send({ partidoPolitico: encontrado });
        } else {
            return res.status(500).send({ message: 'No existe ese partido politico' })
        }
    })
}

function editPartido(req, res) {
    var partidoId = req.params.id;
    var body = req.body;

    PartidoPolitico.findByIdAndUpdate(partidoId, body, { new: true }, (err, actualizado) => {
        if (err) return res.status(500).send({ message: 'error en la peticion' });

        if (!actualizado) return res.status(404).send({ message: 'no se a podido actualizar los datos del partido' })

        return res.status(200).send({ partidoPolitico: actualizado });
    })
}

//subir archivos de imagen
function uploadImage(req, res) {
    var partidoId = req.body.id;

    if (req.files) {

        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[3];

        var ext_split = file_name.split('\.')
        var file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            //actualizar al partido 
            PartidoPolitico.findByIdAndUpdate(partidoId, { image: file_name }, { new: true }, (err, actualizado) => {
                if (err) return res.status(500).send({ message: 'error en la peticion' });

                if (!actualizado) return res.status(404).send({ message: 'no se a podido actualizar los datos del partido' })

                return res.status(200).send({ partidoPolitico: actualizado });
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
    addPartidoPolitico,
    editPartido,
    deletePartidos,
    getPartidos,
    uploadImage,
    getPartido
}