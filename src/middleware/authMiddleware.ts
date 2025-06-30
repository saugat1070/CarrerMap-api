import { Request,Response,NextFunction } from "express";
import jwt from 'jsonwebtoken'
import User from "../Model/authModel/userModel";
import { envConfig } from "../globalConfig/dotenvConfig";
import { userRole } from "../globalConfig/enum";

interface IExtendRequest extends Request{
    user:{
        id:string
    }
}

class AuthMiddleware{
    private jwtSecret: string;
    constructor(){
        this.jwtSecret = envConfig.json_secret_key;
    }
    public IsLoggedIn(req:IExtendRequest,res:Response,next:NextFunction){
        const auth = req.headers.authorization;
        const token  = auth && auth.startsWith("Bearer ") ? auth.split(" ")[1]: auth;
        jwt.verify(token as string,this.jwtSecret, async (err,result:any)=>{
            if(err){
                console.log(err);
                res.status(400).json({
                    message : "something error occur on jwt verification"
                });
            }
            else{
                const userId = result?.userId;
                const user = await User.findOne({_id:userId});
                if(!user){
                    res.status(404).json({
                        messae : "user is not found with this userId"
                    })
                    return;
                }

                req.user = {
                    id:user?._id.toString()
                };
                next();

            }
        })
    }

    public accessTo(...role:userRole[]){
        return async (req:IExtendRequest,res:Response,next:NextFunction)=>{
            const userId = req.user.id;
            const user = await User.findById(userId);
            const userRole:userRole= user?.role as userRole;
            if(!role.includes(userRole)){
                res.status(401).json({
                    status:"failed",
                    message : "user has no access to enroll"
                });
                return;
            }
            next();
        }
    }
}

const authMiddleware = new AuthMiddleware();
export default authMiddleware;