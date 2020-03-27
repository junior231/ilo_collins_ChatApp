// imports always go first - if we're importing anything
import ChatMessage from "./modules/ChatMessage.js";

const socket = io();


// the paccket is whatever data we send through with the connect event 
// from the server
// this is data destructuring. Go look it up on MDN
function setUserId({sID}){
    // debugger;
    console.log(sID);
    vm.socketID = sID;
}

function showDisconnectMessage() {
    console.log('a user disconnected');
}

function updateUsers(users) {
    
    this.users = users;
    debugger;
}

function appendPlayer(user){
    
    vm.players.push(user);
};

function appendMessage(message) {
    vm.messages.push(message)
}

const vm = new Vue({
    data: {
        socketID: "",
        message: "",
        username: "",
        users: [],
        messages: [],
        nickname: ""
    },

    methods: {
        // emit a message event to the server so that 
        // it can in return send this to anyone who is connected
        dispatchMessage() {
            console.log('handle emits message');

            // the double pipe || is an "or" operator
            // if the first value is set, use it. else use whatever comes after the double pipe
            socket.emit('chat_message', {
                content: this.message,
                name: this.nickname || "anonymous"
            })

            this.message = "";
        },

        showUsers(){
            console.log('showing users online');

            socket.emit('userJoined', {
                users: this.users
            })

            this.users.push(this.nickname);
        },

        register() {
            console.log('registered');

            socket.emit('userRegistered', {
                username: this.nickname
            });

        }

    },

    mounted: function() {
        console.log('vue is done mounting');
    },

    components: {
        newmessage: ChatMessage
    }
}).$mount("#app");


socket.addEventListener('connected', setUserId);
socket.addEventListener('disconnect', showDisconnectMessage);
socket.addEventListener('new_message', appendMessage);
socket.addEventListener('userJoined', appendPlayer);
socket.addEventListener('updateUserList', updateUsers);