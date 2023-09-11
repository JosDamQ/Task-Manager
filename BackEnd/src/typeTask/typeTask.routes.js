'use strict'

const typeTaskController = require('./typeTask.controller');
const { ensureAuth } = require('../services/authenticated');
const express = require('express');
const api = express.Router();

//Rutas
api.get('/test', typeTaskController.test);
api.post('/add',ensureAuth, typeTaskController.add);
api.get('/gets', ensureAuth, typeTaskController.getMyTipeTask);
api.get('/get/:id', /*ensureAuth,*/ typeTaskController.getTypeTask);
api.delete('/delete/:id', ensureAuth, typeTaskController.delete);
api.put('/update/:id', ensureAuth, typeTaskController.changeName);

//
module.exports = api