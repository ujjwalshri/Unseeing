
import mongoose from "mongoose";

const userSchema = mongoose.Schema({
   email : {
    type:String,
    required : true,
    unique: true
   },
   password : {
    type : String, 
    required : true
   }, 
   branch : {
      type : String, 
      required : true
   }, 
   stream : {
      type : String, 
      required : true
   }, 

   followers: [
    {
        type : mongoose.Schema.Types.ObjectId,
        ref :  "User",
        default: []
    }
   ],
   following: [
    {
        type : mongoose.Schema.Types.ObjectId,
        ref :  "User",
        default: []
    }
   ],
   profileImg :{
      type: String, 
      default:""
   },
   coverImg :{
    type: String, 
    default:""
 },
   bio : {
    type: String, 
    default:""
   },


}, {timestamps : true});


const User = mongoose.model("User" ,  userSchema);





export default User