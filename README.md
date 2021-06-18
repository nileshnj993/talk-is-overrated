# talk-is-overrated
Basic **Chat App** made using Node.js, Socket.io and HTML, CSS for the front end.

**The web application can be accessed at [talk is overrateed] (https://talk-is-overrated.herokuapp.com)**

To run it locally, you can clone this repository using `git clone https://github.com/nileshnj993/talk-is-overrated.git`. Once cloned, use `npm install` to download the dependencies. Use `npm run dev` to get the server running. The web app can then be accessed at http://localhost:3000. 

**Various features implemented include:**
1. Joining a chat room with chosen username, and having conversation private to the given chat room.
2. Sending your current location if you grant the permission to do so.
3. Displaying name of room, and all users currently in room when you join.
4. Getting notified about users leaving and joining the room.

**A few edge cases have been handled, such as:**
1. Joining a room with a username that has already been taken is not allowed.
2. Submitting the joining form with either of username or room left empty is not allowed.
3. Empty messages can't be sent.

Socket.io is an amazing JS library for realtime web and chat applications. The documentation is available at [Socket.io] (https://socket.io/docs/v4).
