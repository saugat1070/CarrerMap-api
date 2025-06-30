import {Request,Response} from 'express'
import User from '../Model/authModel/userModel';
import bcrypt from 'bcrypt'
import { mailData } from '../globalConfig/interface';
import { registerHtml } from '../Services/mailSender/registerMail';
import sendMail from '../Services/mailSender/mailSender';
import { tokenGen } from '../Services/tokenGen';
class UserController{
    constructor(){

    }

    public async RegisterUser(req:Request,res:Response){
        const {fullName,email,password,confirmPassword} = req.body;
        if(!fullName || !email || !password || !confirmPassword){
            res.status(400).json({
                status : "failed",
                message : "provide all information"
            });
            return;
        };
        
        if(password !== confirmPassword){
            res.status(400).json({
                status : "failed",
                message : "password and confirm password should be same"
            });
            return;
        }

        const registerUser = await User.create({
            email : email,
            password : bcrypt.hashSync(password,10),
            fullName : fullName
        });

        if(!registerUser){
            res.status(500).json({
                message : "register failed during database"
            });
            return;
        }
        const htmlContent:string = registerHtml()

        const data:mailData = {
            to:email,
            from : "carrerMap@gmail.com",
            subject:"Thank You for Registration",
            html: htmlContent
        }
        sendMail(data);

        res.status(200).json({
            status:"success",
            message : "user is register successfully"
        })
        return;
    }

    public async LoginUser(req:Request,res:Response){
        
        const {email,password} = req.body;
        if(!email || !password){
            res.status(400).json({
                message : "provide email and password"
            });
            return;
        }

        const user = await User.findOne({email:email});
        if(!user){
            res.status(404).json({
                message : "user with this email is not found"
            });
        }

        const isPasswordMatch = bcrypt.compareSync(password,user?.password as string);
        if(!isPasswordMatch){
            res.status(401).json({
                status : "failed",
                message : "Password is not correct"
            });
        }

        const token = tokenGen(user?._id);
        res.status(200).json({
            status : "success",
            message : "Login sucess",
            token : token
        });
    }
}

 const userController = new UserController();
 export {userController};