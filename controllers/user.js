const User = require("../models/user");


exports.getUserID = (req,res,next,id) =>{
User.findById(id).exec((err,user) => {
if(err || !user){
    return res.status(400).json({
        errort :"no user was found"
    })
}
req.profile = user
next();
});
};

exports.getUser = (req,res) => {
    return res.json(req.profile)
}