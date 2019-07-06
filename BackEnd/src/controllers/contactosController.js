'use strict'

var Contacto = require('../models/contactos');
var path = require('path');
var fs = require('fs');

function addContacto(req, res) {
    var contacto = new Contacto();
    var params = req.body;
    if (params.nombres && params.apellidos && params.telefono) {
        
        contacto.nombres = params.nombres;
        contacto.apellidos = params.apellidos;
        contacto.apodo = params.apodo;
        contacto.correo = params.correo;
        contacto.direccion = params.direccion;
        contacto.telefono = params.telefono;
        contacto.image = null;

        contacto.user = req.user.sub;

        contacto.save((err, contacGuardado) => {
            if (err) return res.status(500).send({ message: 'Error en la encuesta' })
            if (!contacGuardado) return res.status(500).send({ message: 'Error al agregar la contacto' })

            return res.status(200).send({ contacto: contacGuardado });
        })
    } else {
        res.status(200).send({
            message: 'Rellene todos los datos necesarios'
        })
    }
}
function subirImagen(req, res) {
    var contactoId = req.params.id;

    if (req.files) {
        var file_path = req.files.image.path;
        console.log(file_path);

        var file_split = file_path.split('\\');
        console.log(file_split);

        var file_name = file_split[3];
        console.log(file_name);

        var ext_split = file_name.split('\.');
        console.log(ext_split);

        var file_ext = ext_split[1];
        console.log(file_ext);

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            Contacto.findByIdAndUpdate(contactoId, { image: file_name }, { new: true }, (err, contactoActualizado) => {
                if (err) return res.status(500).send({ message: ' no se a podido actualizar el usuario' })

                if (!contactoActualizado) return res.status(404).send({ message: 'error en los datos del contacto, no se pudo actualizar' })

                return res.status(200).send({ contacto: contactoActualizado });
            })
        } else {
            return removeFilesOfUploads(res, file_path, 'extension no valida')
        }

    }
}

function removeFilesOfUploads(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        return res.status(200).send({ message: message })
    })
}

function obtenerImagen(req, res) {
    var image_file = req.params.nombreImagen;
    var path_file = './src/uploads/users/' + image_file;

    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'no existe la imagen' })
        }
    });
}
function editarContacto(req, res) {
    var conId = req.params.id;
    var params = req.body;

    Contacto.findByIdAndUpdate(conId, params, { new: true }, (err, contacEdit) => {
        if (err) return res.status(500).send({ message: 'error en la peticion' })

        if (!contacEdit) return res.status(404).send({ message: 'no se a podido actualizar los datos del usuario' })

        return res.status(200).send({ contacto: contacEdit })
    })
}
function eliminarContacto(req, res) {
    var conId = req.params.id;

    Contacto.findByIdAndDelete(conId, (err, contacElim) => {
        if (err) return res.status(500).send({ message: 'error en la peticion' })

        if (!contacElim) return res.status(404).send({ message: 'no se a podido actualizar los datos del usuario' })

        return res.status(200).send({ contacto: contacElim })
    })
}


function getContacto(req, res) {
    var id = req.params.id;
    Contacto.findById(id, (error, contacto) => {
        if (error) return res.status(500).send({ message: 'Error en el contacto' })
        if (!contacto) return res.status(400).send({ message: 'Error al 2' })
        return res.status(200).send({ contacto })
    })
}


function getContactos(req, res) {
var userId = req.user.sub
Contacto.find( {user:userId}, (err, encontrados)=>{
    if(err) return res.status(500).send({message:'error en la peticion', err});

    if(encontrados.length >=1){            
        return res.status(200).send({contacto: encontrados});
    }else{
        return res.status(500).send({message: 'No hay ninguna contacto relacionado'})
    }
})
}

module.exports = {
    addContacto,
    getContacto,
    getContactos,
    subirImagen,
    obtenerImagen,
    editarContacto,
    eliminarContacto

    

}