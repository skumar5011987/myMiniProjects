
const socket = io();

let textarea = document.querySelector('#textarea');
let messageArea = document.querySelector('.messageArea');
let audio = new Audio('ting.mp3');
let Uname;
do {
   Uname = prompt('Enter Your name to join :');
} while (!Uname);

socket.emit('new-user-joined', Uname);


textarea.addEventListener('keyup', (e) => {
   if (e.key === 'Enter') {
      sendMessage(e.target.value);
      textarea.value = '';
   }
});

function sendMessage(message) {
   let msg = {
      user: Uname,
      message: message.trim()
   }
   // Appending messages to messageArea
   recieveMessage(msg, 'out');

   // sending messages to server
   socket.emit('sendMessage', msg);
}

function recieveMessage(msg, type) {

   let mainDiv = document.createElement('div');
   let className = type;
   mainDiv.classList.add(className, 'message');

   let html = `
            <h4>${msg.user}</h4>
            <p>${msg.message}</p>
            `;

   mainDiv.innerHTML = html;
   messageArea.appendChild(mainDiv);
   if (type == 'in') {
      audio.play();
   }

}

function appendInfo(html, type) {

   let mainDiv = document.createElement('div');
   let className = type;
   mainDiv.classList.add(className, 'message');

   mainDiv.innerHTML = html;
   messageArea.appendChild(mainDiv);
   if (type == 'in') {
      audio.play();
   }
   
}



// userJoined
socket.on('userJoined', (Uname) => {
   appendInfo(`<h3>${Uname}</h3> joined the chat...`, 'in');
});

// recieveMessage
socket.on('recieveMessage', (msg) => {
   recieveMessage(msg, 'in');
});

//If user Left the Chat
socket.on('userLeft', Uname => {
   appendInfo(`<h3>${Uname}</h3> Left the chat...`, 'in');
});
