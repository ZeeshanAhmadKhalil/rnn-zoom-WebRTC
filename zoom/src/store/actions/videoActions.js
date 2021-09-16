import io from 'socket.io-client'
import Peer from 'react-native-peerjs'
import { ADD_STREAM, MY_STREAM, ADD_REMOTE_STREAM } from './types'

// API URI

// export const API_URI = 'http://192.168.18.91:3000'

// Peer Config


// peerServer.on('error', (error) => {
//     //console.log('PEER ERROR ' + error)
// })

// Socket Config
const socket = io('http://192.168.10.6:3000') // Office

export const joinRoom = (stream) => {
    return async (dispatch) => {
        const peerServer = new Peer(undefined, {
            host: '192.168.10.6',
            secure: false,
            port: 3000,
            path: '/mypeer',
        })
        //console.log('ASYNC DISPACH')
        const roomId = 'sdfadsgsdfgsdfdfghk'
        dispatch({ type: MY_STREAM, payload: stream })
        peerServer.on('open', (userId) => {
            //console.log('OPENED')
            socket.emit('join-room', { userId, roomId })
            //console.log('OPENED..')
        })

        socket.on('user-connected', (userId) => {
            //console.log('USER CONNECTED')
            const call = peerServer.call(userId, stream)
        })
        // Recieve a call
        peerServer.on('call', (call) => {
            //console.log('CALL')
            call.answer(stream)

            // Stream back the call
            call.on('stream', (stream) => {
                dispatch({ type: ADD_STREAM, payload: stream })
            })
        })
    }
}

// function connectToNewUser(userId, stream, dispatch) {
//     //console.log('ADDING USER')
//     const call = peerServer.call(userId, stream)
// }