import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import {connectDB} from './lib/db.js';
import cookieParser from 'cookie-parser';
import chatRoutes from './routes/chat.js';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT ;

app.use(cors({
  origin: 'http://localhost:5173', // Update with your frontend URL
  credentials: true, // Allow credentials (cookies) to be sent
}));

app.use(express.json());
app.use(cookieParser()); // to parse cookies

app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use('/api/chat',chatRoutes);


 app.listen(port,()=>{
  console.log(`Server is running on port ${port} `);
  connectDB();
 })