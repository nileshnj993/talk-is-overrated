// connect to server as a client
const socket = io() // used to initiate connection
const messages = document.getElementById('messages') // div to display messages
const message = document.getElementById('text') // input text
const form = document.getElementById('message') // entire form
const sendButton = document.getElementById('send') // send button
const locationTemplate = document.getElementById('location-template').innerHTML
// Templates
const messageTemplate = document.getElementById('message-template').innerHTML // template code for each message
const sidebarTemplate = document.getElementById('sidebar-template').innerHTML
// Options
const {username, room} = Qs.parse(location.search, { ignoreQueryPrefix:true }) // we are parsing the query string available at location.search ( after logging into a room ) and we are ignoring query prefix '?'

socket.on('message', (message) => {
    console.log(message)
    // listening to messages from server
    // this is where we render the message on ui dynamically
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a') // moment is a library that makes formatting and handling date/time easier
    }) // what will be rendered on ui
    messages.insertAdjacentHTML('beforeend', html) // this ensures that new html is appended on just before the end of div element being selected
    autoscroll()
})

const autoscroll = () => { // automatically scroll when viewing latest message
    // New message element
    const newMessage = messages.lastElementChild // latest message
    
    // height of the latest message
    const newMessageStyles = getComputedStyle(newMessage) // get css properties
    
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin
    const visibleHeight = messages.offsetHeight // visible height
    const containerHeight = messages.scrollHeight // total content height, even hidden content

    // How far have i scrolled?
    const scrollOffset = messages.scrollTop + visibleHeight // distance scrolled from the top + initial visible height
    // we want to know how far from the bottom we are

    if(containerHeight - newMessageHeight <= scrollOffset){
        messages.scrollTop = messages.scrollHeight // scroll all the way to the bottom once you reach the end
    } // check if we have reached bottom before new message added to start scrolling

}

socket.on('locationMessage', (urlObject) => { // separate event handler for location sending so we can make a different template
    console.log(urlObject)
    // second paramter is whatever is being emitted on this listening topic
    const html = Mustache.render(locationTemplate, {
        username: urlObject.username,
        url: urlObject.url,
        createdAt: moment(urlObject.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({room, users}) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.getElementById('sidebar').innerHTML = html
}) 

form.addEventListener('submit', (e) => {
    e.preventDefault()
    // console.log('submitted')
    sendButton.setAttribute('disabled', 'disabled') // disabling form on submission so multiple submissions don't happen before first is done
    socket.emit('sendMessage', message.value, (error) => { // third argument used for acknowledgements. It executes depeending on what server sends back
        sendButton.removeAttribute('disabled') // enable again once message has been sent and acknowledgment received
        message.value="" // clear input after current message has been sent
        message.focus() // takes the cursor back into the text box
        if(error){
            console.log(error)
        }
        else{
        console.log('The message was delivered!')
        }
    }) // sending message typed and submitted by client
})

// url structure of google maps is https://www.google.com/maps?q=latitude,longitude
const locationEvent = document.getElementById('location')
locationEvent.addEventListener('click', () => {
    if(!navigator.geolocation){ // geolocation isn't supported by all browsers so we are just checking if this object exists
        return alert('Geolocation is not supported by your browser')
    }
    locationEvent.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => { // navigator doesn't support promises/async await
        socket.emit('sendLocation', {
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        }, (error) => {
            locationEvent.removeAttribute('disabled')
            if(error){
                console.log("Error")
            }
            else{
                console.log('Location Shared!')
            }
        })
    })
})

socket.emit('join', { username, room }, (error) => { // acknowledgement
    if(error){
        alert(error)
        location.href = '/' // send the person to root of the site on erronous login
    }
}) // send username and room to backend for authenticatation and getting this done

// client(emit) -> server (receive) @ sendMessage
// server(emit) -> client (receive) @ message

// client(emit) -> server (receive) --acknowledgement--> client
// server(emit) -> client (receive) --acknowledgement--> server