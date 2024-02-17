const jwt = require('jsonwebtoken');
const auth = (req,res, next)=>{
    const token = req.headers.authorization?.split(" ")[1];
    if(token){
       const decoded = jwt.verify(token,"masai");
            if(decoded){
                // console.log(decoded);
                req.body.userID = decoded.userID;
                req.body.author = decoded.author;
                // const {userId} = decoded;
                // const user = await UserModel.find({_id: userId});
                // const required_role = user.role;
                // req.role = required_role;
                next();
            } else {
                res.send({msg: "not authorized no access", "error":err});
            }
        }
    else {
       res.send({msg: "pleasse login"});
    }
}
module.exports = {
    auth
}