'use strict'

const userController = require('./user.controller')
const { ensureAuth } = require('../services/authenticated')
const express = require('express');
const api = express.Router();

//Rutas
api.get('/test', userController.test)
api.post('/register', userController.register)
api.post('/login', userController.login)
api.get('/myInfo', ensureAuth, userController.getYourInfo)
api.put('/updateMyInfo', ensureAuth, userController.editYourAccount)
api.delete('/deleteAccount', ensureAuth, userController.deleteAccount)

//
module.exports = api