const messageform = document.querySelector(".chatbox form");
const messageList = document.querySelector("#messagelist");
const userList = document.querySelector("ul#users");
const chatboxinput = document.querySelector(".chatbox input")
const useraddform = document.querySelector(".modal")
const backdrop = document.querySelector(".backdrop")
const useraddinput = document.querySelector(".modal input");
const socket = io("http://localhost:5000");

let users = [];
let messages = [];

socket.on("users", (_users) => {
    users = _users;
    updateUsers();
});

socket.on("history", (_messages) => {
    messages = _messages.reverse();
    updateMessages();
})

socket.on("message", (message) => {
    messages.push(message);
    updateMessages();
});

function messageSubmitHandler(e) {
    e.preventDefault();
    socket.emit("message", chatboxinput.value);
    chatboxinput.value = "";
}

function userAddHandler(e) {
    e.preventDefault();
    const username = useraddinput.value;
    if(!username) return alert("Username cannot be empty");

    socket.emit("adduser", username, (response) => {
        if (!response.ok) {
            alert(response.error);
            return;
        }

        useraddform.classList.add("disappear");
        backdrop.classList.add("disappear");
    });
}

messageform.addEventListener('submit', messageSubmitHandler)
useraddform.addEventListener('submit', userAddHandler)

function updateUsers() {
    userList.textContent = "";
    for (let i = 0; i < users.length; i++) {
        const li = document.createElement("li");
        li.textContent = users[i].username;
        userList.appendChild(li);
    }
}

function updateMessages() {
    messageList.textContent = "";

    for (let i = 0; i < messages.length; i++) {
        messageList.innerHTML += `
            <li>
                <p>${messages[i].user}</p>
                <p>${messages[i].message}</p>
            </li>
        `;
    }
}
