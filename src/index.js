const http = require('http')
const express = require('express')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage,generateLocationMessage} = require('./utils/messages') // as object being returned
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')

const app = express()
const server = http.createServer(app) // this happens behind the scenes even if not mentioned.. But since we are adding websockets, we need to explicitly mention it
const io = socketio(server) // configures socket.io to work with http server

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')


app.use(express.json())
app.use(express.static(publicDirectoryPath))

let welcome = 'Welcome!'
io.on('connection', (socket) => { // socket object(the argument) is created at every new connection initialization. connection is an in built event
    console.log('New Websocket Connection')
    
   // broadcast is same as io.emit but sent to all clients other than the one that just joined
    
    socket.on('join', ( {username,room}, callback ) => {
        const {error, user} = addUser({id:socket.id,username:username,room:room}) // socket.id gives the id of particular connection
        if(error){ // if user not added due to error
            return callback(error)
        }
        // if user successfully added
        socket.join(user.room) // join function is available only on server where this will help us create a localized environment for each room
        socket.emit('message', generateMessage("Admin",welcome))
        // sending welcome message to new client
        socket.broadcast.to(user.room).emit('message', generateMessage("Admin",`${user.username} has joined!`)) // to(room) ensures it is sent only to a given room
        
        io.to(user.room).emit("roomData", { // for displaying room name and users in the room currently
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        callback() // if all was fine
    })
    
    socket.on('sendMessage', (text, callback) => { // waiting for client to send message
        const filter = new Filter()
        if(filter.isProfane(text)){
            return callback('Please mind your language!')
        }
        const user = getUser(socket.id)
        console.log(text)
        io.to(user.room).emit('message', generateMessage(user.username, text)) // forwarding client's message to everyone else who is connected
        callback() // for acknowledgment. We can also send data as arguments of callback
    })
    
    socket.on('sendLocation', ({latitude, longitude}, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${latitude},${longitude}`))
        callback() // no need to validate as we are already using geolocation
    })

    socket.on('disconnect', () => { // code to run when a client gets disconnected
        const user = removeUser(socket.id)
        if(user){ // need to check if user exists to confirm that he actually joined a room, not just invalid login and close window
            io.to(user.room).emit('message', generateMessage("Admin",`${user.username} has left!`)) // no need to use broadcast as current user has already disconnected
            io.to(user.room).emit("roomData", { // for displaying room name and users in the room currently
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
}) // listener object for listening to new client connections


server.listen(port, () => { // server.listen instead of app.listen
    console.log(`Server is up on port ${port}`)
})

// client(emit) -> server (receive) @ sendMessage
// server(emit) -> client (receive) @ message