# Chatty - Real-Time Chat Application

A real-time chat application built with Socket.IO and MongoDB featuring live messaging, online user tracking, and persistent message history.

## Features

-  Real-time messaging with Socket.IO
-  Live online user tracking
-  Persistent message history stored in MongoDB
-  Automatic user status updates (online/offline)
-  Clean and responsive UI
-  Instant message delivery to all connected users

## Project Structure

```
chatty/
├── client/
│   ├── index.html          # Main HTML structure
│   ├── index.js            # Client-side Socket.IO logic
│   └── styles.css          # Application styles
├── models/
│   ├── Message.js          # Message schema
│   └── User.js             # User schema
├── server.js               # Express & Socket.IO server
├── package.json
└── README.md
```

## Tech Stack

**Frontend:**
- HTML5
- CSS3
- Vanilla JavaScript
- Socket.IO Client

**Backend:**
- Node.js
- Express.js
- Socket.IO Server
- MongoDB with Mongoose

## Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (local installation or MongoDB Atlas account)
- npm (comes with Node.js)

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd chatty
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/chatty
   PORT=5000
   ```
   
   *Note: Replace `MONGO_URI` with your MongoDB connection string. For MongoDB Atlas, use:*
   ```
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/chatty
   ```

4. **Start the server**
   ```bash
   node server.js
   ```

5. **Access the application**
   
   Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

## Database Schema

### User Schema

The User model tracks registered users and their online status.

```javascript
{
  username: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: Boolean,
    required: true
  }
}
```

**Fields:**
- `username`: Unique identifier for each user
- `status`: `true` if user is online, `false` if offline

### Message Schema

The Message model stores all chat messages with timestamps.

```javascript
{
  user: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamps: true  // Adds createdAt and updatedAt
}
```

**Fields:**
- `user`: Username of the message sender
- `message`: Content of the message
- `createdAt`: Timestamp when message was created (auto-generated)
- `updatedAt`: Timestamp when message was last updated (auto-generated)

## Client-Server Communication

### Socket Events

#### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `adduser` | `username: String` | Register a new user or mark existing user as online |
| `message` | `text: String` | Send a chat message |
| `disconnect` | - | Automatically triggered when user closes connection |

#### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `users` | `Array<User>` | Broadcast updated list of online users |
| `history` | `Array<Message>` | Send message history to newly connected client |
| `message` | `Message` | Broadcast new message to all connected clients |

### Communication Flow

#### 1. User Connection & Registration

```
Client                          Server                          Database
  |                               |                                 |
  |-------- connect() ----------->|                                 |
  |                               |-------- find messages --------->|
  |<------- history event --------|<-------- messages --------------|
  |                               |                                 |
  |------ adduser(username) ----->|                                 |
  |                               |------ findOne/create user ----->|
  |                               |<--------- user ----------------|
  |                               |------ find online users ------->|
  |<------ users event -----------|<------ online users ------------|
  |<-- callback({ ok: true }) ----|                                 |
```

**Steps:**
1. Client connects to Socket.IO server
2. Server sends message history to client
3. Client submits username via modal
4. Server checks if user exists and is offline, or creates new user
5. Server updates user status to online
6. Server broadcasts updated user list to all clients

#### 2. Sending Messages

```
Client                          Server                          Database
  |                               |                                 |
  |------ message(text) --------->|                                 |
  |                               |------- create message --------->|
  |                               |<-------- message ---------------|
  |<------ message event ---------|                                 |
  |                               |------ broadcast to all -------->|
```

**Steps:**
1. User types message and submits form
2. Client emits message event with text
3. Server creates new message in database
4. Server broadcasts message to all connected clients
5. All clients update their message lists

#### 3. User Disconnect

```
Client                          Server                          Database
  |                               |                                 |
  |-------- disconnect() -------->|                                 |
  |                               |------ update user status ------>|
  |                               |------ find online users ------->|
  |<------ users event -----------|<------ online users ------------|
  |                               |------ broadcast to all -------->|
```

**Steps:**
1. User closes browser or loses connection
2. Socket.IO automatically triggers disconnect event
3. Server updates user status to offline
4. Server broadcasts updated user list to remaining clients

## Key Features Explained

### Real-Time Updates

The application uses Socket.IO's event-driven architecture to provide instant updates:

- **Message broadcasting**: When a user sends a message, it's immediately broadcast to all connected clients
- **User presence**: Online user list updates in real-time when users join or leave
- **Persistent history**: New users see all previous messages upon joining

### User Status Management

The app intelligently handles user status:

- Users marked as online when they connect
- Prevents duplicate usernames for online users
- Allows same username to reconnect if previously offline
- Automatically marks users offline on disconnect

### Error Handling

Built-in validation includes:

- Empty username prevention
- Duplicate online user detection
- Callback-based error messaging to client

## Usage

1. **Join the chat**: Enter a unique username in the modal
2. **Send messages**: Type in the input box and click "Send" or press Enter
3. **View online users**: See all active users in the "Active Users" sidebar
4. **Message history**: Scroll through previous messages in the chat area

## API Endpoints

The server serves static files from the `client` directory:

- `GET /` - Serves `index.html`
- `GET /index.js` - Client-side JavaScript
- `GET /styles.css` - Application styles

## Development

### Running in Development Mode

For auto-restart on file changes, install nodemon:

```bash
npm install -g nodemon
nodemon server.js
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | Required |
| `PORT` | Server port | 5000 |

## Troubleshooting

**Cannot connect to MongoDB**
- Ensure MongoDB is running locally or check your Atlas connection string
- Verify network access settings in MongoDB Atlas

**Socket.IO connection issues**
- Check that the server URL in `client/index.js` matches your server address
- Ensure CORS is properly configured in `server.js`

**Users can't send messages**
- Verify user has successfully registered (modal should disappear)
- Check browser console for errors

## Future Enhancements

- [ ] Private messaging between users
- [ ] Message editing and deletion
- [ ] Typing indicators
- [ ] File/image sharing
- [ ] Message reactions
- [ ] User avatars
- [ ] Chat rooms/channels
- [ ] Message search functionality

## License

This project is open source and available under the [MIT License](LICENSE).

---
