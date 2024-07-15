import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../lib/utils/gen.token.js";

export const signup = async (req, res) => {
    try {
        const { email, password, branch, stream } = req.body;
         console.log(email, password);
        if ( password.length < 6) {
            return res.status(400).json({ err: "password must be of 6 characters" });
        }

        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const isValid = regex.test(email);

        

        if (!isValid) {
            return res.status(400).json({ error: "Invalid email" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ mssg: "Email already exists" });
        }

        // Hash the password to store in the database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            email: email,
            password: hashedPassword,
            branch : branch, 
            stream: stream
        });

        await newUser.save();
        if (newUser) {
            await generateTokenAndSetCookie(newUser._id, res); // Await the token generation
            return res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
                branch : newUser.branch,
                stream : newUser.stream,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,
                bio: newUser.bio
            });
        } else {
            return res.status(400).json({ err: "Invalid user data" });
        }

    } catch (error) {
        console.log(`Error in the signup controller`);
        if (!res.headersSent) {
            return res.status(500).json({ err: `Internal server error: ${error}` });
        } else {
            console.error('Response headers already sent', error);
        }
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(400).json({ err: "Invalid username or password" });
        }

        // Ensure generateTokenAndSetCookie does not send a response
        await generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            email: user.email,
            branch: user.branch,
            stream: user.stream,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
            bio: user.bio
        });
    } catch (error) {
        console.log(`Error in the login controller: ${error}`);
        if (!res.headersSent) {
            res.status(500).json({ err: `Internal server error: ${error}` });
        }
    }
};


export const logout = async (req, res) => {
   try {
    res.cookie("jwt" ,  "", {maxAge:0}); // maxAge 0 will make sure the cookies gets destroyed without any delay
    res.status(200).json({mssg: "Logged out successfully"});
   } catch (error) {
    console.log(`Error in the logout controller: ${error}`);
        if (!res.headersSent) {
            res.status(500).json({ err: `Internal server error: ${error}` });
        }
   }
};


export const getMe = async(req, res) => {
    try {
       
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.log(`Error in the getMe controller: ${error}`);
        if (!res.headersSent) {
            res.status(500).json({ err: `Internal server error: ${error}` });
        }  
    }
}
