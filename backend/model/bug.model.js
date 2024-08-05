import mongoose from "mongoose";

const bugSchema = new mongoose.Schema({
    user :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
}, {timestamp: true});

const Bug = mongoose.model("Bug", bugSchema);

export default Bug;
