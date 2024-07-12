import express from "express";
import authRoutes from './routes/auth.routes.js'
import dotenv from 'dotenv';
import connetMongoDB from "./db/mongo.connection.js";
const app = express();
dotenv.config();
app.use('/api/auth',authRoutes );




app.use(express.json()); // middle ware to parse req.body 

console.log(process.env.MONGO_URI);
const port = process.env.PORT || 8000
app.listen(port,()=>{
   console.log(`server running on the port ${port}`)
   connetMongoDB();
})

