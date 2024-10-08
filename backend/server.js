import path from "path";
import express from "express";
import authRoutes from './routes/auth.routes.js'
import postRoutes from './routes/post.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import userRoutes from './routes/user.routes.js';
import bugRoutes from './routes/bug.routes.js';
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


const port = process.env.PORT || 8000
const __dirname = path.resolve();

app.use(express.json()); // middle ware to parse req.body 
app.use(express.urlencoded({extended : true})); //  to parse the form data in the req.body
app.use(cookieParser());

app.use('/api/auth',authRoutes );
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', bugRoutes );


console.log(process.env.MONGO_URI);
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.listen(port,()=>{
   console.log(`server running on the port ${port}`)
   connetMongoDB();
})

