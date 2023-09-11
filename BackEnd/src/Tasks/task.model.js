'use strict'

const mongoose = require('mongoose');

const task = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    priority: {
        type: Number,
        required: true
    },
    typeTask: {
        type: mongoose.Schema.Types.ObjectId, ref: 'TypeTask',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true
    }
},{
    versionKey: false
})

module.exports = mongoose.model('Task', task);