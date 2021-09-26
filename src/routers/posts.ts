import Post from '../entities/Post';
import auth from '../middleware/auth';
import Sub from '../entities/Sub';
import Comment from '../entities/Comment';
import user from '../middleware/user';

const express = require('express');
const postRouter = express.Router();

postRouter.post('/', user, auth, async (req, res)=> {
    try{
        const {title, body, sub} = req.body;
        const user = res.locals.user
        if(title.trim() === ''){
            return res.status(400).json({title: 'Title must not be empty'})
        } 

        const subRecord = await Sub.findOneOrFail({name: sub})
        const post = new Post({
            title, body, user, sub: subRecord
        })
        await post.save(); 
        return res.json(post);
    }catch(err){    
        console.log(err);
        return res.status(500).json(err);
    }
});

postRouter.get('/',user,async (req, res)=> {

    try {
        const posts = await Post.find({
          order: { createdAt: 'DESC' },
          relations: ['comments', 'votes', 'sub'],
        })
        if (res.locals.user) {
          posts.forEach((p) => p.setUserVote(res.locals.user))
        }
    
        return res.json(posts)
      } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Something went wrong' })
      }
});

postRouter.get('/:identifier/:slug',user, async (req, res)=> {
    const {identifier, slug} = req.params
    try{
        const posts = await Post.findOne(
            { identifier, slug },
            { relations : ['comments', 'sub', 'votes'] } ); 
        if (res.locals.user) {
            posts.setUserVote(res.locals.user)
        }
        return res.json(posts);
    }catch(err){    
        console.log(err);
        return res.status(404).json({error: 'Post not found'});
    }
});

postRouter.post('/:identifier/:slug/comments',user, auth, async (req, res)=> {
    const {identifier, slug} = req.params;
    const body = req.body.body
    try{
        const post = await Post.findOneOrFail(
            { identifier, slug })
        const comment = new Comment({
            body,
            user : res.locals.user,
            post
        })
        await comment.save();
        return res.json(comment);
    }catch(err){    
        console.log(err);
        return res.status(404).json({error: 'Post not found'});
    }
});

postRouter.get('/:identifier/:slug/comments',user, async (req, res)=> {
    const {identifier, slug} = req.params;
    const body = req.body.body
    try{
        const post = await Post.findOneOrFail(
            { identifier, slug })
        
        const comments = await Comment.find({
            where : { post },
            order: { createdAt : 'DESC'},
            relations: ['votes']
        })

        if(res.locals.user){
            comments.forEach(c=> c.setUserVote(res.locals.user))
        }

        return res.json(comments);
    }catch(err){    
        console.log(err);
        return res.status(500).json({error: 'Something went wrong'});
    }
});

export default postRouter; 
