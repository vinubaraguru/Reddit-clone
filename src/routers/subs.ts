import { isEmpty } from 'class-validator';
import auth from '../middleware/auth';
import Sub from '../entities/Sub';
import { getRepository } from 'typeorm';
import user from '../middleware/user';
import { NextFunction, Request, Response } from 'express';
import Post from '../entities/Post';
import multer, { FileFilterCallback } from 'multer';
import { makeid } from '../utils/helpers';
import path from 'path';
import User from '../entities/User';
import fs from 'fs'

const express = require('express');
const subRouter = express.Router();

const createSub = async ( req : Request, res: Response) => {
    const { name, title, description} = req.body;
    const user = res.locals.user
    console.log(user)
    try{
     
        let errors: any = {}
        
        if(isEmpty(name)) errors.username = 'Name must not be empty';
        if(isEmpty(title)) errors.password = 'Title must not be empty';


        const sub =  await getRepository(Sub)
            .createQueryBuilder('sub')
            .where('lower(sub.name)  = :name', {name: name.toLowerCase()})
            .getOne()
        
        if(sub) errors.name ='Sub exists already';
        if(Object.keys(errors).length>0){
            throw errors;
        }
    }catch(err){    
        console.log(err);
        return res.status(500).json(err);
    }
    try{
        const sub = new Sub({ name, description, title, user})
        await sub.save();
        return res.json(sub)
    }catch(err){
        console.log(err);
        return res.status(500).json(err);
    }
}

const getSub = async ( req : Request, res: Response) => {
    const name = req.params.name
    try{
        const sub = await Sub.findOneOrFail({name})
        const posts = await Post.find({
            where : {sub},
            order: {createdAt:'DESC'},
            relations: ['comments', 'votes']
        })
        sub.posts = posts
        if (res.locals.user) {
            posts.forEach((p) => p.setUserVote(res.locals.user))
          }
        return res.json(sub);
    
    }catch(err){    
        console.log(err);
        return res.status(404).json(err);
    }
}

const ownSub = async (req: Request, res: Response, next: NextFunction) => {
    const user: User = res.locals.user
  
    try {
      const sub = await Sub.findOneOrFail({ where: { name: req.params.name } })
  
      if (sub.username !== user.username) {
        return res.status(403).json({ error: 'You dont own this sub' })
      }
  
      res.locals.sub = sub
      return next()
    } catch (err) {
      return res.status(500).json({ error: 'Something went wrong' })
    }
  }

const upload = multer({
    storage: multer.diskStorage({
      destination: 'public/images',
      filename: (_, file, callback) => {
        const name = makeid(15)
        callback(null, name + path.extname(file.originalname)) // e.g. jh34gh2v4y + .png
      },
    }),
    fileFilter: (_, file: any, callback: FileFilterCallback) => {
      if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        callback(null, true)
      } else {
        callback(new Error('Not an image'))
      }
    },
  })

const uploadSubImage = async (req: Request, res: Response) => {
    const sub: Sub = res.locals.sub
    try {
      const type = req.body.type
      console.log(req.file)
  
      if (type !== 'image' && type !== 'banner') {
        fs.unlinkSync(req.file.path)
        return res.status(400).json({ error: 'Invalid type' })
      }
  
      let oldImageUrn: string = ''
      if (type === 'image') {
        oldImageUrn = sub.imageUrn ?? ''
        sub.imageUrn = req.file.filename
      } else if (type === 'banner') {
        oldImageUrn = sub.bannerUrn ?? ''
        sub.bannerUrn = req.file.filename
      }
      await sub.save()
  
      if (oldImageUrn !== '') {
        fs.unlinkSync(`public\\images\\${oldImageUrn}`)
      }
  
      return res.json(sub)
    } catch (err) {
      console.log(err)
      return res.status(500).json({ error: 'Something went wrong' })
    }
  }
  

subRouter.post('/', user, auth, createSub)
subRouter.get('/:name', user, getSub)
subRouter.post(
    '/:name/image',
    user,
    auth,
    ownSub,
    upload.single('file'),
    uploadSubImage
  )

export default subRouter; 
