import express,{ Router } from "express";
import { userController } from "../../Controller/userController";

const router:Router = express.Router()

router.route("/register").post(userController.RegisterUser)
router.route("/login").post(userController.LoginUser)



export default router;