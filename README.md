# Chatty – Real‑Time Chatroom Application (WebSockets)

A lightweight, real‑time chat application built with **Socket.IO**, **Express**, and **MongoDB**.  
Users can join the room, see who’s online, and send messages that are instantly broadcast to everyone—all with persistent history.

---

## Features

- Real‑time messaging via Socket.IO  
- Live online user tracking  
- Persistent chat history stored in MongoDB  
- Automatic online/offline status updates  
- Clean, responsive UI with vanilla HTML/CSS/JS  
- Instant delivery to all connected clients

---

## Project Structure

```
Real-Time-chatroom-application-using-WebSockets/
├── client/
│   ├── index.html          # Main HTML UI
│   ├── index.js            # Client-side Socket.IO logic
│   └── styles.css          # Stylesheet
├── models/
│   ├── Message.js          # Mongoose schema for messages
│   └── User.js             # Mongoose schema for users
├── server.js               # Express & Socket.IO server
├── package.json            # Dependencies & scripts
└── README.md               # ← you are here!
```

---

## Tech Stack

**Frontend**  
HTML5 · CSS3 · Vanilla JavaScript · Socket.IO Client

**Backend**  
Node.js · Express.js · Socket.IO Server · MongoDB + Mongoose

---

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14+)
- [MongoDB](https://www.mongodb.com/) — local or Atlas
- npm (bundled with Node.js)

---

## Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/ArnavVivek13/Real-Time-chatroom-application-using-WebSockets.git
   cd chatty
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the project root:

   ```env
   MONGO_URI=mongodb://localhost:27017/chatty
   PORT=5000
   ```

   > For Atlas:
   > `MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/chatty`

4. **Start the server**

   ```bash
   node server.js
   ```

5. **Open the app**

   Visit: `http://localhost:5000`

---

## Database Schemas

### User

```js
{
  username: { type: String, required: true, unique: true },
  status:   { type: Boolean, required: true } // true = online
}
```

### Message

```js
{
  user:    { type: String, required: true },
  message: { type: String, required: true }
}, { timestamps: true }
```

---

## Socket Events

### **Client → Server**

| Event       | Payload                | Description                         |
|-------------|------------------------|-------------------------------------|
| `adduser`   | `{ username: String }` | Register/set user online            |
| `message`   | `{ text: String }`     | Send a chat message                 |
| `disconnect`| —                      | Fired when connection closes        |

### **Server → Client**

| Event       | Payload           | Description                       |
|-------------|-------------------|-----------------------------------|
| `users`     | `Array<User>`     | Updated online user list          |
| `history`   | `Array<Message>`  | Full message history on connect   |
| `message`   | `Message`         | Broadcast a new chat message      |

---

## Communication Flow

1. Client connects → server sends history.  
2. Username submitted → server updates/creates user and broadcasts user list.  
3. Messages emit → server saves & broadcasts to everyone.

---

## License

This project is licensed under the [MIT License](LICENSE).
---

*Have ideas for rooms, authentication, or deployment? Contributions welcome!*
