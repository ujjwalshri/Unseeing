import Notification from "../model/notification.model.js";
import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import {v2 as cloudinary} from 'cloudinary';

export const getUserProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById( id ).select("-password");
    if (!user) return res.status(400).json({ error: "User not find" });
    res.status(200).json(user);
  } catch (err) {
    console.log(
      `error in the user controller in the getuser profile function ${err.message}`
    );
    res.status(500).json({ mssg: "Internal server error" });
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;

    const toFollow = await User.findById(id);
    const currentUser = await User.findById(req.user._id);
    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You can not follow and unfollow yourself" });
    }
    if (!toFollow || !currentUser)
      return res
        .status(400)
        .json({ error: "User not found to follow or unfollow" });
    const isFollowing = currentUser.following.includes(id);
    if (isFollowing) {
      // Unfollow the user since you are already following this user
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      return res
        .status(200)
        .json({ message: "successfully unfollowed the user" });
    } else {
      // Follow this user
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      // send notification to the user
      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: toFollow._id,
      });
      await newNotification.save();

      // todo return the res as the id of the user;
      return res
        .status(200)
        .json({ message: "You have successfully followed the user" });
    }
  } catch (error) {
    console.log(
      `error in the user controller in the followUnfollowUser function ${err.message}`
    );
    res.status(500).json({ mssg: "Internal server error" });
  }
};

export const getSuggestedUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const userFollowedByMe = await User.findById(userId).select("following");
    const users = await User.aggregate([
      {
        $match: { _id: { $ne: userId } },
      },
      { $sample: { size: 10 } },
    ]);
    const filteredUser = users.filter((user) => !userFollowedByMe.following.includes(user._id));
    const suggestedUsers = filteredUser.slice(0,4);
    suggestedUsers.forEach((user) => (user.password = null));
    return res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log(`error in the getSuggested User controller  ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUser =  async(req, res) =>{
  const { email,branch, stream,  bio , currentPassword, newPassword } = req.body;
 
    let {profileImg, converImg} = req.body;
    const userId = req.user._id;
  try {
    let user = await User.findById(userId);
    if(!user) return res.status(404).json({error : "user not found"});
    if( (!newPassword && currentPassword) || (newPassword && !currentPassword)){
      return res.status(400).json({error : "enter both new password along with the current password"});
    }
    if( newPassword.length < 6) {
      return res.status(400).json({error : "password length should be more than or equal to 6"});
    }



    if(currentPassword && newPassword){
      
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      
      if(!isMatch) return res.status(400).json({error : "Please enter the correct current password"});
      const salt = await bcrypt.genSalt(10);
      const hashedPassword  = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;

    }

    if(profileImg){
      /// if users is having a profile img previously we have to remove the previous image of his from the cloudinary cloud 
      if(user.profileImg){
       
        await cloudinary.uploader.destroy(user.profileImg.split('/').pop().split('.')[0]);
      }





      //update the profile image to be able to update an image and store and image we have to use the cloudinary platform
      
      
      const uploadedResponse = await cloudinary.uploader.upload(profileImg);
     profileImg = uploadedResponse.secure_url;

    }
    if(converImg){
      // similarly just like the profile image 
      if(user.converImg){
       
        await cloudinary.uploader.destroy(user.converImg.split('/').pop().split('.')[0]);
      }


      const uploadedResponse = await cloudinary.uploader.upload(converImg);
      converImg = uploadedResponse.secure_url;
    }
    user.email = email || user.email;
    user.branch = branch || user.branch;
    user.stream = stream || user.stream;
    user.bio = bio || user.bio;
    user.profileImg = profileImg || user.profileImg;
    user.converImg = converImg || user.converImg;
   user = await user.save();


   user.password = null; //  making the password null in the response
   return res.status(200).json(user);

  } catch (error) {
    console.log(`error in the user controller update profile function ${ error.message}`);
    return res.status(500).json({error : "Internal server error"});
  }
}