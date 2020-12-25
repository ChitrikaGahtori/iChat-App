const socket = io('http://localhost:8000')

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
var audio = new Audio('ting.mp3');

const append = (message , position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position=='left')
    {
        audio.play();
    }  
}

// If a form get submitted , send server the message
form.addEventListener('submit' , (e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`,'right');
    socket.emit('send',message);
    messageInput.value = "";
})

// Ask new user for his/her name and let the server know
const name = prompt("Enter your name to join");
socket.emit('new-user-joined',name);

// If a new user joins ,receice his/her name to the server
socket.on('user-joined', name => {
    append(`${name} joined the chat`,'right')
});

// If server sends a message , receive it
socket.on('receive', data => {
    append(`${data.name} : ${data.message}`,'left')
});

// If a user leave the chat , append the info to the container
socket.on('left', data => {
    append(`${data.name} left the chat`,'left')
});
