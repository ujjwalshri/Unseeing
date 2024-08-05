import Bug from "../model/bug.model.js";

export const storeBug = async (req, res) => {
    try {
        const userId =req.user._id;
        console.log(req.body);
        const {title, description} = req.body;
        if (!title || !description) {
            return res.status(400).json({message: 'Please fill all fields'});
        }
        const bug = new Bug({
            user: userId,
            title,
            description
        });
        bug.save();
        res.status(201).json({message: 'Bug reported successfully'});
    } catch (error) {
        console.log(` error in the bug controller function storeBug: ${error}`);
        res.status(500).json({message: 'Internal server error'});
    }
}

