'use stict'

const Task = require('./task.model');
const TypeTask = require('../typeTask/typeTask.model');
const { json } = require('express');
const { validateData } = require('../utilis/validate');

exports.test = async(req, res) => {
    try{
        return res.send({message: 'Test is running'})
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error general'})
    }
}

exports.add = async(req, res) => {
    try{
        let data = req.body;
        let userId = req.user.sub;
        //Validamos que si nos llegue data
        if(!data.name || data.name == '' || !data.description || data.description == '' || !data.priority || data.priority == '' ||
            !data.endDate || data.endDate == '' || 
            !data.typeTask || data.typeTask == '') return res.status(400).send({message: 'Data required'});

        //Agregamos el ID del usuario; 
        data.user = userId
        //Validamos que el typeTask que va a agregar si exista
        let existTypeTask = await TypeTask.findOne({_id: data.typeTask, user: userId})
        if(!existTypeTask) return res.status(400).send({message: 'TypeTask does not exist or not the own'});
        //Validamos que el usuario que quiera agregar una tarea sea el mismo que 
        /*let sameUser = await TypeTask.findOne({user: userId})
        if(!sameUser) return res.status(404).send({message: 'Yor not de owner of this typeTask'})*/
        
        //Validamos que no se agregue una tarea repetida
        let existTask = await Task.findOne({name: data.name, endDate: data.endDate, description: data.description, priority: data.priority, user: userId})
        if(existTask) return res.status(402).send({message: 'Task already exists'});

        //Guardamos
        let newTask = await Task(data);
        newTask.save();
        return res.send({message: 'Task added succesfully'});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error adding a task'})
    }
}

exports.getMyTasks = async(req, res)=>{
    try{
        let userId = req.user.sub;
        let tasks = await Task.find({user:userId});
        if(tasks.length == 0) return res.status(400).send({message: 'You dont have any tasks'});
        return res.send(tasks).populate('typeTask');
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting my tasks'});
    }
}

exports.getTask = async(req, res) => {
    try{
        let taskId = req.params.id;
        let userId = req.user.sub;
        let task = await Task.findOne({_id: taskId, user: userId}).populate('typeTask');
        if(!task) return res.status(404).send({message: 'Task not found or not the own of the Task'});
        return res.send(task)
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting my task'})
    }
}

exports.searchByName = async(req, res) => {
    try{
        let data = req.body;
        let params = {
            name: data.name
        }
        let validate = validateData(params);
        if(validate) return res.status(400).send(validate);
        let tasks = await Task.find({
            name: {
                $regex: params.name,
                $options: 'i'
            }
        }).populate('typeTask')
        return res.send({tasks})
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error searching by name'})
    }
}

exports.updateTask = async(req, res) => {
    try{
        let data = req.body;
        let userId = req.body;
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error updating the task'})
    }
}