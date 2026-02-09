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

let MONGO_URI = process.env.MONGO_URI;
let port = process.env.PORT || 5000;

mongoose.connect(MONGO_URI).then(() => {
    console.log("Mongoose Connected!");
});

server.listen(port, () => {
    console.log("listening at port", port)
});
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
        let newMessage = await Message.create({
            user: socket.user,
            message: text,
        })
        io.sockets.emit("message", newMessage);
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