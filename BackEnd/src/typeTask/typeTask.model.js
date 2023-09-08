'use strict'

const mongoose = require('mongoose')

const typeTask = mongoose.Schema({
    name: {
        type: String,
        //enum: ['Trabajo', 'Colegio', 'Casa', 'Personal'],
        required: true
        
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{
    versionKey: false
})

module.exports = mongoose.model('TypeTask', typeTask)