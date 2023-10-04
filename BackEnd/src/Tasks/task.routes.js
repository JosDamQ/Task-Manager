'use strict'

const taskController = require('./task.controller')
const { ensureAuth } = require('../services/authenticated');
const express = require('express');
const api = express.Router();

//Rutas
api.get('/test', taskController.test);
api.post('/addTask', ensureAuth, taskController.add);
api.get('/getMyTask', ensureAuth, taskController.getMyTasks);
api.get('/getTask/:id', ensureAuth, taskController.getTask);

//
module.exports = api