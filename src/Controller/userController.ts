import { Request, Response } from "express";
import User from "../Model/authModel/userModel";
import bcrypt from "bcrypt";
import { mailData } from "../globalConfig/interface";
import { registerHtml } from "../Services/mailSender/registerMail";
import sendMail from "../Services/mailSender/mailSender";
import { tokenGen } from "../Services/tokenGen";
import { otpGen } from "../Services/otpGen";

class UserController {
  constructor() {}
  public async RegisterUser(req: Request, res: Response) {
    const { fullName, email, password, confirmPassword } = req.body;
    if (!fullName || !email || !password || !confirmPassword) {
      res.status(400).json({
        status: "failed",
        message: "provide all information",
      });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({
        status: "failed",
        message: "password and confirm password should be same",
      });
      return;
    }

    const registerUser = await User.create({
      email: email,
      password: bcrypt.hashSync(password, 10),
      fullName: fullName,
    });

    if (!registerUser) {
      res.status(500).json({
        message: "register failed during database",
      });
      return;
    }
    const htmlContent: string = registerHtml();

    const data: mailData = {
      to: email,
      from: "carrerMap@gmail.com",
      subject: "Thank You for Registration",
      html: htmlContent,
    };
    sendMail(data);

    res.status(200).json({
      status: "success",
      message: "user is register successfully",
    });
    return;
  }

  public async LoginUser(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        message: "provide email and password",
      });
      return;
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(404).json({
        message: "user with this email is not found",
      });
    }

    const isPasswordMatch = bcrypt.compareSync(
      password,
      user?.password as string
    );
    if (!isPasswordMatch) {
      res.status(401).json({
        status: "failed",
        message: "Password is not correct",
      });
    }

    const token = tokenGen(user?._id);
    res.status(200).json({
      status: "success",
      message: "Login sucess",
      token: token,
    });
  }

  public async forgetPassword(req: Request, res: Response) {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({
        message: "please provide your email",
      });
      return;
    }

    try {
      const findUser = await User.findOne({ email: email });
      if (!findUser) {
        res.status(404).json({
          status: "failed",
          message: "user with this email is not found",
        });
        return;
      }

      const otpCode = otpGen();

      const updateOtp = await User.findOneAndUpdate(
        { email: email },
        {
          otp: otpCode,
        }
      );
      if (!updateOtp) {
        res.status(500).json({
          message: "something is error during update otp on database ",
        });
        return;
      }

      setTimeout(async () => {
        await User.findOneAndUpdate(
          { email: email },
          {
            otp: "",
          }
        );
      }, 10 * 1000);

      res.status(200).json({
        status: "otp fetch successfully",
        otp: otpCode,
      });
    } catch (error: any) {
      console.log(error?.message);
      res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  }

  public async verifyOtp(req: Request, res: Response) {
    const { email, otp } = req.body;
    if (!email || !otp) {
      res.status(400).json({
        message: "email and otp should be provided",
      });
      return;
    }

    try {
      const findUser = await User.findOne({ email: email });
      if (!findUser) {
        res.status(404).json({
          message: "user with this email is not found",
        });
        return;
      }

      if (otp != findUser?.otp) {
        res.status(403).json({
          message: "otp didn't match",
        });
        return;
      }

      res.status(200).json({
        status : "success",
        message : "otp verified"
      })

    } catch (error) {
        res.status(503).json({
            status : "failed",
            message : "something wrong during otp verification"
        })

    }
  }

  public async changePassword(req:Request,res:Response){
    const {currentPassword,newPassword,confirmPassword,email} = req.body;
    if(!currentPassword || !newPassword || !confirmPassword || !email){
        res.status(400).json({
            status : "fail",
            message : "old password and new password must be provided"
        });
        return;
    }
    try {
        const findUser = await User.findOne({email:email});
        if(!findUser){
            return new Error("User with this email is not found");
        }
        if(newPassword != confirmPassword){
            res.status(400).json({
                status: "fail",
                message : "both password must be same"
            });
            return;
        }

        findUser.password = bcrypt.hashSync(newPassword,10);
        await findUser.save();
        res.status(200).json({
            status : "success",
            message : "password change successfully"
        })

    } catch (error:any) {
        console.log(error.message);
        res.status(500).json({
            status : "failed",
            message : error.message
        })
    }

  }

}

const userController = new UserController();
export { userController };
