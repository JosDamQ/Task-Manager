'use strict'

require('dotenv').config();
const mongoConfig = require('./config/mongo');
const app = require('./config/app');
const userController = require('./src/users/user.controller')

mongoConfig.connect();
app.initServer();