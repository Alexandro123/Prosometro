'use strict'

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');
var path = require('path');
var fs = require('fs');

var Contactos = require('../models/contactos');




function getUser(req, res){

    User.find().exec((err, usuariosEncontrados)=>{
        if(err) return res.status(500).send({message : 'Request Erro!'});

        if(!usuariosEncontrados) return res.status(400).send({message : 'No se encontraron datos'});

        return res.status(200).send({usuarios : usuariosEncontrados});  
    })

}

function registrar(req, res){
    var user = new User();
    var params = req.body;

    if( params.usuario && params.email && params.password){
        user.nombre = params.nombre;
        user.apellido = params.apellido;
        user.usuario = params.usuario;
        user.email = params.email;
        user.password = params.password;
        user.rol = 'USER';  
        user.image = null;

        
        User.find({ $or: [
            
            {usuario: user.usuario.toLowerCase()},
            {email: user.email.toLowerCase()},
        ]}).exec((err, users) =>{
            if(err) return res.status(500).send({message: 'Error en la peticion de usuarios'});
            if(users && users.length >= 1){
                return res.status(500).send({message: 'El usuario ya existe'});
            }else{
                bcrypt.hash(params.password, null,null, (err, hash)=>{
                    user.password = hash;

                    user.save((err, userStored)=>{
                        if(err) return res.status(500).send({message: 'Error al guardar el usuario'});

                        if(userStored){
                            res.status(200).send({user: userStored})
                        }else{
                            res.status(404).send({message: 'no se ha registrado el usuario'});
                        }
                    });
                });
            }
        });
    }else{
        res.status(200).send({
            message: 'Rellene todos los datos necesarios'
        });
    }

}

function login(req, res) {
    var params = req.body;
    var email2 = params.email;
    var password = params.password;

    User.findOne({email: email2}, (err, user)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'})
    
        if(user){
            bcrypt.compare(password, user.password, (err, check)=>{
                if(check){
                    if(params.gettoken){
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        })
                    } else{
                        user.password = undefined;


                        
                        return res.status(200).send({user})
                    }
                } else{
                    return res.status(404).send({message: 'el usuario no se a podido identificar'})
                }
            });
        } else{
            return res.status(404).send({message: 'el usuairo no se a podido logear'})
        }
    });
}


function subirImagen(req, res) {
    var userId = req.params.id;
  
    if(req.files){
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

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
            User.findByIdAndUpdate(userId, {image: file_name}, {new:true}, (err, usuarioActualizado)=>{
                if(err) return res.status(500).send({message: ' no se a podido actualizar el usuario'})
                
                if(!usuarioActualizado) return res.status(404).send({message: 'error en los datos del usuario, no se pudo actualizar'})
                
                return res.status(200).send({user: usuarioActualizado});
            })
        } else{
            return removeFilesOfUploads(res, file_path, 'extension no valida')
        }
        
    }
}

function removeFilesOfUploads(res, file_path, message) {
    fs.unlink(file_path, (err)=>{
        return res.status(200).send({message: message})
    })
}

function obtenerImagen(req, res) {
    var image_file = req.params.nombreImagen;
    var path_file = './src/uploads/users/' + image_file;

    fs.exists(path_file, (exists)=>{
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'no existe la imagen'})
        }
    });
}

function editarUsuario(req, res) {
    var userId = req.params.id;
    var params = req.body;

    //BORRAR LA PROPIEDAD DE PASSWORD
    delete params.password;

    if(userId != req.user.sub){
        return res.status(500).send({message: 'no tiene los permisos para actualizar los datos de este usuario'})
    }

    User.findByIdAndUpdate(userId, params, {new:true}, (err, usuarioActualizado)=>{
        if(err) return res.status(500).send({message: 'error en la peticion'})

        if(!usuarioActualizado) return res.status(404).send({message: 'no se a podido actualizar los datos del usuario'})

        return res.status(200).send({user: usuarioActualizado})
    })
}


module.exports = {
    
    registrar,
    login,
    subirImagen,
    obtenerImagen,
    editarUsuario,
    getUser
}
