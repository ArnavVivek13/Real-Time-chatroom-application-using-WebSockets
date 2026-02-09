const mongsoose = require('mongoose');

const userSchema = new mongsoose.Schema({
    username: {
        unique: true,
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
    }
})

module.exports = mongsoose.model("User", userSchema)