'use stict'

const Task = require('./task.model')

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
        
    }catch(err){
        console.error(err);
        return res.send(500).send({message: 'Error adding a task'})
    }
}