// const express = require('express')
// const http = require('http')
// const socketio = require('socket.io')
// const morgan = require("morgan")
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
const port = 3000;

// //console.log('CAN CONSOLE HERE')

const {
    ExpressPeerServer
} = require('peer')

// const app = express();

// const server = http.createServer(app)
// const io = socketio(server).sockets

app.use(express.json())
const customGenerationFunction = () => {
    return (Math.random().toString(36) + '0000000000000000000').substr(2, 16)
}

const peerServer = ExpressPeerServer(server, {
    debug: true,
    path: '/',
    generateClientId: customGenerationFunction,
})

app.use('/mypeer', peerServer)

io.on('connection', (socket) => {
    //console.log('CONNECTED')
    socket.on('join-room', ({ roomId, userId }) => {
        //console.log(userId)
        //console.log('JOIN ROOM EMITTED')
        socket.join(roomId)
        //console.log('ROOM ID JOINED')
        socket.to(roomId).broadcast.emit('user-connected', userId)
        //console.log('BROADCAST')
    })
})
// io.on("connection", socket => {
//     //console.log("a user connected :D");
// });

// const port = process.env.PORT || 5000;
// server.listen(port, () => {
//     // //console.log(io);
//     return //console.log('server is running on port ' + port)
// })
server.listen(port, () => //console.log("server running on port:" + port));