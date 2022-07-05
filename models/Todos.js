const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types

const todoSchema = new mongoose.Schema({
    taskname: {
        type: String,
        required: true
    },
    tasks:
        [
            {
                subTaskName: { type: String, required: true },
                isDone: { type: Boolean, required: true, default: false }
            }
        ],

    deadline: {
        type: String,
        required: true
    },
    createdBy: {
        type: ObjectId,
        ref: "Users",
    }
})

const TODO = mongoose.model("Todos", todoSchema)

module.exports = TODO;