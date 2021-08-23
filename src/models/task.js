const mongoose = require('mongoose')

const taskSchema = mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    image: {
        type: Buffer
    }
}, {
    timestamps: true
})

const Task = mongoose.model('Task', taskSchema)

// Creating new task by node:

// const task = new Task({
//     description: '   Reapair the shelter\'snpm door   ',
//     completed: false
// })

// task.save().then(() => {
//         console.log(task);
//     }).catch((error) => {
//         console.log('Error!', error);
//     })

module.exports = Task

