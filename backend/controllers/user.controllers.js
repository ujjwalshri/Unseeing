import Notification from "../model/notification.model.js";
import User from "../model/user.model.js";

export const getUserProfile = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email }).select("-password");
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
