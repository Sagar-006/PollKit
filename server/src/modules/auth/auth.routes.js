import {Router} from "express";
import * as controller from "./auth.controller.js";
import RegisterDto from "./dto/register.dto.js";
import validate from "../../common/middleware/validate.middleware.js";
import LoginDto from "./dto/login.dto.js";
import {isLoggedIn} from './auth.middleware.js';

const router = Router();

router.post("/register",validate(RegisterDto), controller.register);
router.post("/login",validate(LoginDto),controller.login);
router.post("/refreshtoken",controller.refreshToken)
router.get("/myprofile", isLoggedIn, controller.myProfile);
router.post("/logout",isLoggedIn, controller.logout);


export default router;