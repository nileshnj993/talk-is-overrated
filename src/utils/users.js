// keep track of users

const users = []

// add user 

const addUser = ({id, username, room}) => { // each client-server connection has a unique socket id
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if(!username || !room){
        return {
            error: "Username and Room are required!"
        }
    } // validating data

    // check for existing user
    const existingUser = users.find((user)=>{ // pass user object with id, username, room as attributes
        return user.room === room && user.username === username // if same username there in a given room. same username in different rooms is fine
    })

    if(existingUser){ // validate user
        return{
            error: 'Username already taken!'
        }
    }
    // store user
    const user = { id, username, room }
    users.push(user)
    return { user }
} 

const removeUser = (id) => {
    const index = users.findIndex((user) => { // similar to find but returns index of found element instead of value
        return user.id == id
    })

    if(index!=-1){
        return users.splice(index,1)[0] // splice helps us remove elements from arrays based on their index. second argument is number of occurrences to remove. splice will return an array of the deleted element. [0] helps display the object of deleted user
    }
}

const getUser = (id) => {
    const user = users.find((user) => {
        return user.id == id
    })
    if(!user){
        return{
            error: "User not found!"
        }
    }
    
    return user
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    const userList = []
    var i = 0
    while(i<users.length){
        if(users[i].room == room){
            userList.push(users[i])
        }
        i++
    }
    return userList
}

// addUser({
//     id:22,
//     username:'Nilesh',
//     room:'test'
// })

// addUser({
//     id:23,
//     username:'Anoop',
//     room:'test'
// })

// addUser({
//     id:22,
//     username:'Nilesh',
//     room:'alone'
// })

// addUser({
//     id:24,
//     username:'Shubham',
//     room:'test'
// })

// // console.log(getUser(22))
// // console.log(getUser(25)) - error
// // console.log(getUserRoom(22,'test'))
// console.log(getUsersInRoom('test'))

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}

