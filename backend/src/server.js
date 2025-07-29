import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import {connectDB} from './lib/db.js';
import cookieParser from 'cookie-parser';
import chatRoutes from './routes/chat.js';
import cors from 'cors';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT ;

const __dirname = path.resolve();


app.use(cors({
  origin: 'http://localhost:5173', // Update with your frontend URL
  credentials: true, // Allow credentials (cookies) to be sent
}));

app.use(express.json());
app.use(cookieParser()); // to parse cookies

app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use('/api/chat',chatRoutes);

if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

 app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend','dist','index.html'));
 })

}


 app.listen(port,()=>{
  console.log(`Server is running on port ${port} `);
  connectDB();
 })