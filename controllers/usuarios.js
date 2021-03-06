
const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const usuariosGet = async (req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;

    // const usuarios = await Usuario.find({ estado: true })
    //     .skip( Number(desde) )
    //     .limit( Number(limite) );

    // const total = await Usuario.countDocuments({ estado: true });

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments({ estado: true }),
        Usuario.find({ estado: true })
            .skip( Number(desde) )
            .limit( Number(limite) )
    ]);


    res.json({
        total, 
        usuarios
    });
}

const usuariosPost = async (req = request, res = response) => {

    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario( { nombre, correo, password, rol } );

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    // Guardar en BD
    await usuario.save();

    res.json({
        usuario

    });
}

const usuariosPut = async (req = request, res = response) => {

    const id = req.params.id;
    const { _id, password, google, correo,  ...resto } = req.body;

    // TODO validar contra base de datos
    if( password ) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.status(500).json( usuario );
}

const usuariosPatch = (req = request, res = response) => {
    res.json({
        msg: 'patch API - controlador'
    });
}

const usuariosDelete = async (req = request, res = response) => {

    const { id } = req.params;


    // Fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete( id );

    // Este campo se agregó en el middleware con el jwt en validarJWT, ver en rutas
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false } );
    // const usuarioAutenticado = req.usuario;

    res.json( usuario );
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}