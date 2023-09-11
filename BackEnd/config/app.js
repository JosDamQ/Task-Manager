'use strict'

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3200;
const userRoutes = require('../src/users/user.routes')
const typeTask = require('../src/typeTask/typeTask.routes');
const taskRoutes = require('../src/Tasks/task.routes');

//Coonfigurar server HTTP
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

//Rutas
app.use('/user', userRoutes);
app.use('/typeTask', typeTask);
app.use('/task', taskRoutes)

//Levantar el server
exports.initServer = () =>{
    app.listen(port);
    console.log(`Server is running in port ${port}`);
}