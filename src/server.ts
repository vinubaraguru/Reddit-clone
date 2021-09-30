import "reflect-metadata";
import {createConnection} from "typeorm";
import express from 'express';
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from './routers/auth';
import trim from "./middleware/trim";
import postRouter from "./routers/posts";
import cookieParser from "cookie-parser";
import subRouter from "./routers/subs";
import miscRouter from "./routers/misc";
import userRouter from "./routers/users";

dotenv.config();
const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(trim)
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin:'http://localhost:3000',
    optionsSuccessStatus: 200
}));
app.use(express.static('public'))

app.get('/', (req,res)=>{
    res.send("Hey Vinu,")
})
app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);
app.use('/api/subs', subRouter);
app.use('/api/misc', miscRouter);
app.use('/api/users', userRouter)
app.use(trim);


app.listen(5000, async()=>{
    console.log(`🚀  Server ready at 5000`);
    try {
        await createConnection();
        console.log('Database connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})