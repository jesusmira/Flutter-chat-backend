const { Socket } = require('dgram');
const express = require('express');
const path = require('path');
require('dotenv').config();

// Db config
require('./database/config').dbConecction();


// para ejecutar normal 'npm start', con nodemon 'npm run start:dev'
//  App de express
const app = express();

// Lectura y parseo del Body
app.use(express.json());

// Node server
const server = require('http').createServer(app);
module.exports.io = require('socket.io')(server);
require('./sockets/socket');



// Path público

const publicPath = path.resolve(__dirname, 'public')
app.use(express.static(publicPath));

// Mis rutas

app.use('/api/login', require('./routes/auth'));


server.listen(process.env.PORT, (err) => {
    if (err) throw new Error(err);

    console.log('Servidor corriendo en puerto: ', process.env.PORT);

});