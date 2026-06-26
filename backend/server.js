import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { userRouter } from './src/routes/user.route.js';
import connectDB from './src/config/db.js';

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json({}));
app.use("/api/user",userRouter);

connectDB();
app.listen(port,()=>{
        console.log(`App is running on PORT: ${port}`)
})