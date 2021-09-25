import { isEmpty, validate } from 'class-validator';
import User from '../entities/User';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import auth from '../middleware/auth';
import user from '../middleware/user';

const express = require('express');
const authRouter = express.Router();

const mapError = (errors : Object[]) =>{
    return errors.reduce((prev: any, err: any) => {
        prev[err.property]= Object.entries(err.constraints)[0][1]
        return prev;
    }, {});
}

authRouter.post('/register', async (req, res)=> {
    const {username, password, email} = req.body;
    try{
        let errors: any = {}
        const emailUser = await User.findOne({email})
        const usernameUser = await User.findOne({username})

        if(emailUser) errors.email = 'Email is already taken';
        if(usernameUser) errors.username = 'Username is already taken';

        if(Object.keys(errors).length>0)return res.status(400).json(errors)


        const user = new User({
            email, username, password, 
        })
        errors = await validate(user)
        if(errors.length>0)return res.status(400).json(mapError(errors))
        await user.save();
        return res.json(user);
    }catch(err){    
        console.log(err);
        return res.status(500).json(err);
    }
});

authRouter.post('/login', async (req, res)=> {
    const {username, password} = req.body;
    try{
        let errors: any = {}
        
        if(isEmpty(username)) errors.username = 'Username must not be empty';
        if(isEmpty(password)) errors.password = 'Password must not be empty';

        if(Object.keys(errors).length>0) return res.status(400).json(errors)

        const user = await User.findOne({username})
        if(!user) return res.status(404).json({username : 'User not found'})

        const passwordMatch =  await bcrypt.compare(password, user.password)
        if(!passwordMatch) return res.status(401).json({password : 'Password is incorrect'})
        const token  = jwt.sign({username}, '1234567890');

        res.set('Set-Cookie', cookie.serialize('token',token, {
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:'strict',
            maxAge:3600,
            path:'/'
        }))

        return res.json({user, token});
    }catch(err){    
        console.log(err);
        return res.status(500).json(err);
    }
});

authRouter.get('/me', user,auth, (_, res)=> {
    return res.json(res.locals.user)
})


authRouter.get('/logout', user, auth, async (req, res)=> {
    res.set('Set-Cookie', cookie.serialize('token','', {
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production',
        sameSite:'strict',
        expires:new Date(0),
        path:'/'
    }))

    return res.status(200).json({success: true})
});

export default authRouter; 
