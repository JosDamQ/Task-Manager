'use strict'

const TypeTask = require('./typeTask.model')
//const User = requestIdleCallback

exports.test = async(req, res) => {
    try{
        return res.send({message: 'Test is running'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error general'})
    }
}

exports.add = async(req, res) => {
    try{
        let data = req.body;
        let userId = req.user.sub;
        //Validamos que si nos llegue data
        if(!data.name || data.name == '') return res.status(400).send({message: 'The params is requerided'});
        //Asignanis el id del parametro user automaticamente mediante el token del que esta loggeado
        data.user = userId;
        //Validamos que el usuario no este ingresando un tipo de tarea que ya existe para el mismo
        let existTypeTask = await TypeTask.findOne({name: { $regex: new RegExp(`^${data.name}$`, 'i') }, user: userId});
        if(existTypeTask) return res.status(401).send({message: 'You already have this typeTask created...'})
        //Guardamos
        let newTypeTask = await TypeTask(data);
        newTypeTask.save();
        return res.send({message: 'TypeTask created succesfully'})
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error addin typeTask'});
    }
}

exports.getMyTipeTask = async(req, res) => {
    try{
        let userId = req.user.sub;
        let myTypeTasks = await TypeTask.find({user: userId}).select('-user');
        if(myTypeTasks.length == 0) return res.send({message: 'You dont have any typeTask'});
        return res.send({message: 'This are your typeTask' , myTypeTasks});

    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting my typeTask'});
    }
}

exports.getTypeTask = async (req, res) => {
    try{
        //let userId = req.params.sub
        let typeTaskId = req.params.id
        //Verificamos que el tipo de tarea exista
        let existTypeTask = await TypeTask.findOne({_id: typeTaskId});
        if(!existTypeTask) return res.status(404).send({message: 'TypeTask not found'});
        return res.send({existTypeTask});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting the typeTask'})
    }
}

exports.changeName = async(req, res) => {
    try{
        let data = req.body;
        let userId = req.user.sub;
        let typeTaskId = req.params.id
        let existType = await TypeTask.findOne({name: { $regex: new RegExp(`^${data.name}$`, 'i') }, user: userId});
        if(existType){
            //Ir a buscar a la BD si id que viene en ruta = id del nombre que está mandando
            if(existType._id != typeTaskId) return res.status(400).send({message: 'TypeTask already exists'});
            let update = await TypeTask.findOneAndUpdate(
                {_id: typeTaskId},
                data,
                {new: true}
            );
            if(!update) return res.status(404).send({message: 'TypeTask not found and not updated'});
            return res.send({update})
        }
        let update = await TypeTask.findOneAndUpdate(
            {_id: typeTaskId},
            data,
            {new: true}
        );
        if(!update) return res.status(404).send({message: 'TypeTask not found and not updated'});
        return res.send({update})
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error changing the name'})
    }
}

exports.delete = async (req, res) => {
    try{
        let typeTaskId = req.params.id
        let userId = req.user.sub
        //Validamos que exista el id que mandamos por medio de la ruta y que sea solo el usuario el que lo pueda borrar
        let existTypeTask = await TypeTask.findOne({_id: typeTaskId, user: userId});
        if(!existTypeTask) return res.status(404).send({message: 'TypeTask not found'});
        //Eliminamos
        await TypeTask.deleteOne({_id: typeTaskId, user: userId });
        return res.send({message: 'TypeTask deleted succesfully'});
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error deleting'});
    }
}