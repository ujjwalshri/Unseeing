import express from "express";
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js';
import dotenv from 'dotenv';
import connetMongoDB from "./db/mongo.connection.js";
import cookieParser from "cookie-parser";
import {v2 as cloudinary} from 'cloudinary';
const app = express();
dotenv.config();

cloudinary.config({
   cloud_name : process.env.CLOUDINARY_CLOUD_NAME, 
   api_key: process.env.CLOUDINARY_API_KEY, 
   api_secret : process.env.CLOUDINARY_API_SECRET, 
})




app.use(express.json()); // middle ware to parse req.body 
app.use(express.urlencoded({extended : true})); //  to parse the form data in the req.body
app.use(cookieParser());

app.use('/api/auth',authRoutes );

app.use('/api/users', userRoutes);



console.log(process.env.MONGO_URI);
const port = process.env.PORT || 8000
app.listen(port,()=>{
   console.log(`server running on the port ${port}`)
   connetMongoDB();
})

