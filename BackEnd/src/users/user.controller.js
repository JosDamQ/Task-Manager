'use strict'

const User = require('./user.model')
const { checkPassword, encrypt, validateData } = require('../utilis/validate')
const { createToken } = require('../services/jwt');
const { compare } = require('bcrypt');

exports.test = async(req, res) => {
    try{
        return res.send({message: 'All is ok'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error general '})
    }
}

exports.login = async(req, res) => {
    let data = req.body;
    if(!data.email || data.email == '' || !data.password || data.password == '') return res.status(404).send({message: 'This params are requerited'});
    let msg = validateData(data.email, data.password, data.name, data.surname, data.phone);
    if (msg) return res.status(400).send({ message: msg });
    let user = await User.findOne({ email: data.email});
    if (user && await checkPassword(data.password, user.password)) {
        let token = await createToken(user)
        let userLogged = {
            email: user.email,
            name: user.name,
        }
        return res.send({ message: 'User logged succesfully', token, userLogged })
    }
    return res.status(404).send({ message: 'Invalid Credentials' })
}

exports.register = async(req, res) => {
    try{
        let data = req.body
        let emailExist = await User.findOne({email: data.email})
        if(emailExist) return res.status(401).send({message: 'Email already exists'})
        let msg = validateData(data)
        if(msg) return res.status(400).send(msg)
        data.password = await encrypt(data.password)
        let user = new User(data)
        await user.save()
        return res.send({message: 'Account created succesfully'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error creating account', err})
    }
}

exports.updatePassword = async (req, res) => {
    try {
      let clientId = req.params.id
      let params = {
        before: req.body.before,
        after: req.body.after
      }
      let msg = validateData(params)
      if(req.user.sub != clientId) return res.status(403).send({message: 'You cant edit this user'})
      if (msg) return res.status(400).send({ msg });
      let user = await User.findOne({ _id: clientId });
      if (!user) return res.status(404).send({ message: 'User not found' });
      params.after = await encrypt(params.after)
      if (await compare(params.before, user.password)) {
        await User.findOneAndUpdate(
          { _id: clientId },
          { password: params.after },
          { new: true }
        )
        return res.status(201).send({ message: 'Password was updated' })
      }
      return res.status(401).send({ message: 'Invalid Password' });
    } catch (err) {
      console.error(err);
      return res.status(500).send({message:'Error updating the password'})
    }
}

exports.getYourInfo = async(req, res) => {
    try{
        let userId = req.user.sub
        let userExist = await User.findOne({_id: userId}).select('-password')
        if(!userExist) return res.status(404).send({message: 'User not found'})
        return res.send(userExist)
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error getting your info'})
    }
}

exports.editYourAccount = async(req, res) => {
    try{
        let data = req.body
        let userId = req.user.sub
        //Definimos los parametros para actualizar
        let params = {
            name: data.name,
            surname: data.surname,
            email: data.email,
            phone: data.phone
        }
        //Verficamos que el userName no se pueda repetir
        let existUserName = await User.findOne({email: params.email})
        //Si existe verificamos que el propio usuario es el que tenga asignado ese username y que si ya lo tiene otro no lo deja
        if(existUserName){
            if(existUserName._id != userId) return res.status(400).send({message: 'Email already in use'})
            let updateInfo = await User.findOneAndUpdate(
                {_id: userId}, 
                params,
                {new: true, runValidators:true}
            ).select('-password');
            //Verificar que el usuario exista
            if(!updateInfo ) return res.status(404).send({message: 'User not found and not updated'});
            return res.send({updateInfo})
        }
        //si no existe el username en la base de datos procedemos sin problema
        let updateInfo = await User.findOneAndUpdate(
            {_id: userId}, 
            params,
            {new: true, runValidators:true}
        ).select('-password');
        //Verificar que el usuario exista
        if(!updateInfo ) return res.status(404).send({message: 'User not found and not updated'});
        return res.send({updateInfo})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error updating my account', err})
    }
}

exports.deleteAccount = async(req, res)=>{
    try{
        let userId = req.user.sub
        let existUser = await User.findOneAndDelete({_id: userId})
        if(!existUser) return res.status(404).send({message: 'User not found'})
        return res.send({message:'Account deleted succesfully'});
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error deleting your account'})
    }
}