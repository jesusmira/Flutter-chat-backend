const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');



const crearUsuario = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado'
            });
        }

        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        // Generar JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            // msg: 'Crear Usuario!!!'
            // body: req.body
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }



};

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        const usuarioDb = await Usuario.findOne({ email });
        if (!usuarioDb) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }

        // validar el password
        const validPassword = bcrypt.compareSync(password, usuarioDb.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña no es valida'
            });
        }

        // Generar el token

        const token = await generarJWT(usuarioDb.id);

        res.json({
            ok: true,
            usuario: usuarioDb,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });

    }



}

const renewToken = async(req, res = response) => {

    // const uid uid del usuario
    const uid = req.uid;

    // generar un nuevo JWT  generarJWT.. 
    const token = await generarJWT(uid);

    // obtener el usuario por el uid ... Usuario.findById..
    const usuario = await Usuario.findById(uid);


    res.json({
        ok: true,
        usuario,
        token
    });

}

module.exports = {
    crearUsuario,
    login,
    renewToken
}