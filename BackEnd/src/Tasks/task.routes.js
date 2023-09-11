'use strict'

const taskController = require('./task.controller')
const { ensureAuth } = require('../services/authenticated');
const express = require('express');
const api = express.Router();

//Rutas
api.get('/test', taskController.test);

//
module.exports = api