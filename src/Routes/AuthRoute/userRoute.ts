import express,{ Router } from "express";
import { userController } from "../../Controller/userController";
import authMiddleware from "../../middleware/authMiddleware";
const router:Router = express.Router()

router.route("/register").post(userController.RegisterUser)
router.route("/login").post(userController.LoginUser)

router.route("/forgetpassword").post(userController.forgetPassword);
router.route("/verifyotp").post(userController.verifyOtp);

export default router;