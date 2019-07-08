'use strict'

var PartidoPolitico = require('../models/partidoPolitico');

function addPartidoPolitico(req, res){
    var partidoPolitico = new PartidoPolitico();
    var body = req.body;

    if(body.name /*&& body.image*/){
        partidoPolitico.name = body.name;
        //partidoPolitico.image = body.image;
        partidoPolitico.image = null;
        partidoPolitico.paraBuscar = '1';

        //usuarios duplicados
        PartidoPolitico.find({name: body.name}).exec((err, partidos) => {
            if (err) res.status(500).send({message: 'error en la peticion de usuarios'});

            if (partidos && partidos.length >= 1){
                return res.status(200).send({message: 'El partido ya existe'})
            }else{
                partidoPolitico.save((err, partidoStored) => {
                    if (err) return res.status(500).send({message: 'error al guardar el usuario'});
        
                    if (partidoStored){
                        res.status(200).send({partidoPolitico: partidoStored});
                    }else{
                        res.status(404).send({message:'no se ha registrado el usuario'});
                    }
                })
            }
        })
        
    }else{
        res.status(200).send({
            message: 'Envie todos los campos necesarios'
        })
    }
}

function deletePartidos(req, res){
    var partidoId = req.params.id;
    var body = req.body;

    PartidoPolitico.findByIdAndRemove(partidoId, (err, borrado) => {
        if (err) return res.status(500).send({ message: 'error en la peticion' })

        if (!borrado) return res.status(404).send({ message: 'no se a podido borrar al partido' })

        return res.status(200).sen({partidoPolitico: borrado})
    });
}

function getPartidos(req, res){
    PartidoPolitico.find( {paraBuscar: '1'}, (err, encontrados) => {
        if(err) return res.status(500).send({message: 'error en la pericion', err});

        if (encontrados.length >= 1){
            return res.status(200).send({partidoPolitico: encontrados});
        }else{
            return res.status(500).send({message: 'No hay ninguna partido politico'})
        }
    });
}

function editPartido(req, res){
    var partidoId = req.params.id;
    var body = req.body;

    PartidoPolitico.findByIdAndUpdate(partidoId, body, {new: true}, (err, actualizado) => {
        if (err) return res.status(500).send({message: 'error en la peticion'});

        if(!actualizado) return res.status(404).send({message: 'no se a podido actualizar los datos del partido'})

        return res.status(200).send({partidoPolitico: actualizado});
    })
}

//subir archivos de imagen
function uploadImage(req, res){
    if(req.files){

        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        

    }
}

module.exports = {
    addPartidoPolitico,
    editPartido,
    deletePartidos,
    getPartidos,
    uploadImage
}