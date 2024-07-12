import User from "../model/user.model.js";
import  bcrypt from "bcryptjs";
 export const signup = async(req,res)=>{
    try {
        const { email, password }  = req.body;
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        // If the string matches the regular expression
        const isValid =  regex.test(email);
        if(!isValid) res.status(400).json({error : "invalid email"})

        const existingEmail = await User.findOne({ email });
        if(existingEmail) {
            return res.status(400).json({mssg : "email is already existing"});
        }



        // hash the password to store in the database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            email:email, 
           password: password, 


        })

        if(newUser){
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id : newUser._id,
                email:  newUser.email,
                followers : newUser.followers, 
                following : newUser.following, 
                profileImg : newUser.profileImg, 
                coverImg : newUser.coverImg, 
                bio : newUser.bio
            })
        }else{
          res.status(400).json({ err : "invalid user data"});
        }

        





    } catch (error) {
        console.log(` error in the signup controller`);
        res.status(500).json({err: `internal server error ${error}`});
    }
}
export const logout = async(req,res)=>{
    res.json({
        mssg: "you have hit the signup end point"
    })
}
export const login = async(req,res)=>{
    res.json({
        mssg: "you have hit the signup end point"
    })
}