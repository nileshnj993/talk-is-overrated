const generateMessage = (username,text) => { // text is the message to be sent
    return {
        username: username,
        text: text,
        createdAt: new Date().getTime() // time in milliseconds since jan 1 1970
    }
}

const generateLocationMessage = (username, url) => {
    return{
        username: username,
        url:url,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage
}

// sending message and timestamp as an object using one function for better readability