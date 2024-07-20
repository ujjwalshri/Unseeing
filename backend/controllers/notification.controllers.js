import Notification from "../model/notification.model.js";

export const getAllNotifications  = async(req, res) =>{
  try {
    const userId = req.user._id;
    const notification = await Notification.find( { to : userId}).sort({createdAt: -1}).populate({
        path : "from", 
        select : "branch profileImg"
    });
    await Notification.updateMany({to : userId} , {read:true});
    return res.status(200).json(notification);
  } catch (error) {
    console.log(`error in the notification controller in the getAllNotification method ${error.message}`);
    return res.status(500).json({error : "Internal server Eror"});
  }
}


export const deleteNotification  = async(req, res) =>{
    try {
        const userId = req.user._id;
        await Notification.deleteMany({to : userId});
        return res.status(200).json({message : "notification deleted"});
    } catch (error) {
        console.log(`error in the notification controller in the deleteNotification method ${error.message}`);
        return res.status(500).json({error : "Internal server Eror"});
    }
}
