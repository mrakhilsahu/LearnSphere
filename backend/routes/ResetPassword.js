import express from "express";
import { resetPassword,resetPasswordToken } from "../controllers/ResetPassword.js"; // exact file name
import { auth } from "../middlewares/authmiddleware.js"; // exact folder + file
import mailSender from "../utils/mailsender.js";


const router = express.Router();

// forgot password
router.post("/forgot", resetPasswordToken);

// reset password
router.post("/reset", resetPassword);

export default router;
