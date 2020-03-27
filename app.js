var express = require('express');
var app = express();

// add socket here
const io = require('socket.io')();

const port = process.env.PORT || 3030;

// tell express where our static files are (js, images, css etc)
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

//made server an object for socket.io because it needs a var to bind to
const server = app.listen(port, () => {
    console.log(`app is running on port ${port}`);
});

// attach our chat server to our app
io.attach(server);
let userList = [];

io.on('connection', function(socket) {  // socket id your connection
    console.log('a user has connected');
    


    socket.emit('connected', { sID: socket.id, message: "new connection", users: userList });

    socket.on('chat_message', function(msg) {
        console.log(msg); // lets see what the payload is from the client side


        // tell the connection maanger (io) to send this message to everyone
        // anyone connected to our chat app will get this message (including the sender)
        io.emit('new_message', { id: socket.id, message: msg })
    })

    socket.on('userRegistered', function(user) {
        userList.push(user.username);

        io.emit('updateUserList', {users: userList})
    })

    socket.on('userJoined', function(user){
        console.log(user + 'has joined the chat');
        io.emit('newUser', user);
    })

    socket.on('disconnect', function() {
        console.log('a user has disconnected');
    })
})