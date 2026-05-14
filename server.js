const express = require('express')
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const Message = require('./models/Message');
const User = require('./models/User');
const dotenv = require('dotenv');
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.static("client"))

const MONGO_URI = process.env.MONGO_URI;
const port = process.env.PORT || 5000;

function validateMongoUri(uri) {
    if (!uri) {
        throw new Error("Missing MONGO_URI environment variable.");
    }

    if (uri.includes("<") || uri.includes(">")) {
        throw new Error("MONGO_URI still contains placeholder angle brackets. Replace <db_password> with your real MongoDB Atlas password.");
    }
}

async function startServer() {
    try {
        validateMongoUri(MONGO_URI);
        await mongoose.connect(MONGO_URI);
        console.log("Mongoose Connected!");

        await User.updateMany({}, { status: false });
        console.log("Reset all users to offline");

        server.listen(port, () => {
            console.log("listening at port", port)
        });
    } catch (err) {
        console.error("Failed to start server:", err.message);
        process.exit(1);
    }
}

startServer();
io.on('connection', async (socket) => {
    console.log('connected to', socket.id)

    try{
        const messages = await Message.find().sort({createdAt: -1});
        socket.emit("history", messages);
    } catch (err) {
        console.log(err);
    }

    socket.on("adduser", async (username, callback) => {
        let user = await User.findOne({username: username});
        if (user && user.status === true) {
            callback({ ok: false, error: "User already online" });
            return;
        }
        if (!user) {
        user = await User.create({
            username,
            status: true
        })
        }
        else{
            user.status = true;
            await user.save().then(user => {console.log("updated user", user)}).catch(err => console.log(err));
        }
        socket.user = username;
        const onlineUsers = await User.find({ status: true });
        console.log("latest users", onlineUsers)
        io.sockets.emit("users", onlineUsers)
        callback({ ok: true });
    })
    socket.on("message", async (text) => {
        const message = text?.trim();
        if (!socket.user || !message) return;

        try {
            let newMessage = await Message.create({
                user: socket.user,
                message,
            })
            io.sockets.emit("message", newMessage);
        } catch (err) {
            console.log(err);
        }
    })
    socket.on("disconnect", async () => {
        if(!socket.user) return;

        await User.updateOne(
            {username: socket.user},
            {status: false}
        )

        const onlineUsers = await User.find({status: true});
        io.sockets.emit("users", onlineUsers)
        console.log('remaining users: ', onlineUsers)
    })
});
