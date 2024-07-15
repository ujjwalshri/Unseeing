import express from "express";
import authRoutes from './routes/auth.routes.js'
import dotenv from 'dotenv';
import connetMongoDB from "./db/mongo.connection.js";
import cookieParser from "cookie-parser";
const app = express();
dotenv.config();


app.use(express.json()); // middle ware to parse req.body 
app.use(express.urlencoded({extended : true})); //  to parse the form data in the req.body
app.use(cookieParser());

app.use('/api/auth',authRoutes );





console.log(process.env.MONGO_URI);
const port = process.env.PORT || 8000
app.listen(port,()=>{
   console.log(`server running on the port ${port}`)
   connetMongoDB();
})

