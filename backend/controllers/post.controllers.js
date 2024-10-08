import Notification from "../model/notification.model.js";
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

export const commentOnPost = async(req, res)=>{
    try {
        const {text} = req.body;
       
        const postId = req.params.id;
        console.log(postId);
        const userId = req.user._id;
        if(!text) return res.status(400).json({error : "Please provide some text"});
       const post = await PostModel.findById(postId);
        
       if(!post) return res.status(400).json({error : "post not found"});
       const comment = {user : userId , text};
       post.comments.push(comment);
       await post.save();
       return res.status(200).json(post);
    } catch (error) {
        console.log(`error in the post controller commenOnPost function ${error.message}`);
        return res.status(500).json({error : "Internal server error"});
    }
}

export const likeOnPost = async(req, res) =>{
    try {
        const userId = req.user._id;
        const postId = req.params.id;
        const post = await PostModel.findById(postId);
        
        if(!post) return res.status(404).json({error : "Post not found"});
        const userLikedPost = post.likes.includes(userId);
        if(userLikedPost){
            // user have already liked the post so just go and unlike it 
             await PostModel.updateOne({ _id: postId }, { $pull: { likes: userId } });
             await User.updateOne({ _id : userId} , {$pull : { likedPosts : postId}});

            const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());
            return res.status(200).json(updatedLikes);
           
        }else{
            // user have not ever liked the post so go ahead and like the post;
            post.likes.push(userId);
            await User.updateOne({ _id : userId} , {$push : { likedPosts : postId}});
            await post.save();
          
            const notification = new Notification({
                from : userId, 
                to :post.user,
                type : 'like'
            })
            await notification.save();
            const updatedLikes = post.likes;
            return res.status(201).json(updatedLikes);
        }

    } catch (error) {
        console.log(`Error found in the likeOnPost controller of the post controllers  ${error.message}`);
        return res.status(500).json({error : "Internal server error"});
    }
}

export const getAllPosts = async(req, res) =>{
    try {
        const posts = await PostModel.find().sort({createdAt : -1}).populate({
            path :"user", 
            select : "-password"
        }).populate({
            path : "comments.user",
            select : '-password'
        });
        return res.status(200).json(posts);
    } catch (error) {
        console.log(`err : ${error.message}`);
        return res.status(500).json({error : "Internal server error"});
    }
}

export const getLikedPosts = async (req, res) =>{
    const userId = req.params.id;
    try {
        const user = await  User.findById(userId);
        if(!user) return res.status(404).json({error : "User not found"});
        const likedPosts = await PostModel.find({ _id : {$in : user.likedPosts}})
        .populate({
            path : "user", 
            select : "-password"
        }).populate({
            path : "comments.user", 
            select : "-password"
        });
        return res.status(200).json(likedPosts);

    } catch (error) {
        console.log(`error in the post controller in the getLikedPost fucntion ${error.message}`);
        return res.status(500).json({error : "Internal server errorr"});
    }
}

export const getFollowingPost = async(req, res ) =>{
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({error : "404 user not found"});
        const following  = user.following;
        const feedPosts = await PostModel.find( { user : {$in : following}})
        .sort({createdAt : -1}).populate({
            path : "user", 
            select : "-password"
        }).populate({
            path : "comments.user", 
            select: "-password",
        })

        return res.status(200).json(feedPosts);
    } catch (error) {
        console.log(`Error in the post controller get all following fucntion ${error.message}`);
        return res.status(500).json({error : "Internal server error"});
    }
}


export const getUserPosts = async(req, res)=>{
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if(!user) return res.status(404).json({error : "User not found"});
   const posts = await PostModel.find( {user  : userId })
   .sort({createdAt : -1}).populate({
    path : "user", 
    select : "-password"
   }).populate({
    path : "comments.user", 
    select : "-password"
   })
    
   return res.status(200).json(posts);
  } catch (error) {
    console.log(`error in the getUserpost function in the post controllers ${error.message}`);
    return res.status(500).json({error : "Internal server error"});
  }
}