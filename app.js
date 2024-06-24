import express from 'express'
import authRoute from './routes/auth.route.js';
import testRoute from './routes/test.route.js'
import userRoute from './routes/user.route.js'
import postRoute from './routes/post.route.js'
import chatRoute from './routes/chat.route.js'
import messageRoute from './routes/message.route.js'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import bodyParser from 'body-parser';
const app = express();

// console.log('test3');
app.use(cors({origin:process.env.CLIENT_URL,credentials:true}));
app.use(bodyParser.json());
app.use(cookieParser());
// app.get('/api/send',(async(req,res)=>{
//     res.json("test")
// }))
app.use('/api/auth',authRoute);
app.use('/api/test',testRoute);
app.use('/api/user',userRoute);
app.use('/api/post',postRoute);
app.use('/api/chat',chatRoute);
app.use('/api/message',messageRoute);

app.listen(5000,()=>{
    console.log('server running on 5000');
});