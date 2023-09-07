'use strict'

const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                // Expresión regular para validar un email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value);
            },
            message: 'Invalid email format'
        }
    },
    phone: {
        type: Number,
        required: true,
        validate: {
            validator: function(value) {
                // Verificar si el número tiene exactamente 8 dígitos
                return /^\d{8}$/.test(value);
            },
            message: 'Phone number must have exactly 8 digits'
        }
    },
    password: {
        type: String,
        required: true
    }
    /*role: {
        type: String,
        required: true,
        enum: ['ADMIN', 'CLIENT']
    }*/
},{
    versionKey: false
})

module.exports = mongoose.model('User', userSchema)