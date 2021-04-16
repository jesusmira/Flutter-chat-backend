const { io } = require('../index');

// Mensajes de Sockets

io.on('connection', client => {
    console.log('Cliente conectado');

    client.on('disconnect', () => {
        console.log('Cliente desconectado')
    });

    // ecuchar eventos

    client.on('mensaje', (payload) => {
        console.log('Mensaje ', payload);

        // avisar al usuario o a todos los usuarios

        io.emit('mensaje', { admin: 'Nuevo mensaje' });


    })
});