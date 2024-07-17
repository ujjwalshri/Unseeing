import PostModel from "../model/post.model.js";
import User from "../model/user.model.js";

export const createPost = async( req, res) =>{
    try {
        const {text} = req.body;
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user) return res.status(400).json({error : "invalid user"});
        if(!text) return res.status(400).json({error : "Please provide some text"});
        const newPost = new PostModel({
            user : userId,
            text, 

        })

        await newPost.save();
        return res.status(201).json(newPost);

    } catch (error) {
        console.log(`error in the create post method of the post controller ${error.message}`);
        return res.status(500).json({error : `internal server err ${error.message}`});
    }
}

export const deletePost = async(req, res) =>{
    try {
       const postId = req.params.id;
       const post = await PostModel.findById(postId);
       if(!post) return res.status(400).json({error : "please select a post to delete"});
       if(post.user.toString() !== req.user._id.toString()){
        return res.status(400).json({error :  "You are not authorized to delete this post"});
       }
       await PostModel.findByIdAndDelete(postId);
       return res.status(201).json({message : "Post deleted succesfully"});

    } catch (error) {
        console.log(`error in the deletePost method of the post controller,  ${error.message}`);
        return res.status(400).json({error :`internal server error`});
    }
}