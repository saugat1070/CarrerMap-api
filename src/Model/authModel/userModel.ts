import mongoose from "mongoose";
import { userRole } from "../../globalConfig/enum";
const userAuthModel = new mongoose.Schema({
    email:{
        type:String,
        null:false
    },
    fullName:{
        type:String,
        null:false
    },
    password:{
        type:String,
        null:true
    },
    role:{
        type:String,
        enum: [userRole.student,userRole.mentor,userRole.admin],
        default: userRole.student
    }
},
{
    timestamps : true
})

const User = mongoose.model("User",userAuthModel);
export default User;