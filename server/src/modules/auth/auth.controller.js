import * as authService from "./auth.service.js";
import User from "./auth.model.js";
import ApiResponse from "../../common/utils/api-response.js";
import cookie from "cookie-parser"
const register = async(req,res) => {
    
    const user = await authService.register(req.body);

    ApiResponse.created(res,"registration successfully",user);
}

const login = async(req,res) => {
    const {user,accessToken,refreshToken} = await authService.login(req.body);

    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        secure:true,
        sameSite:"strict",
        maxAge:24 * 60 * 60 * 1000
    });

    ApiResponse.ok(res,"Login successfully",{user,accessToken})
}

const refreshToken = async(req,res) => {
    const {token} = req.params;

    const {accessToken,refreshToken} = await authService.refreshToken(token);
    ApiResponse.ok(res,"Token refreshed",{accessToken,refreshToken})
}

const logout = async(req,res) => {
    await authService.logout(req.user.id);
    ApiResponse.ok(res, "Logged out successfully");
    
}

const myProfile = async(req,res) => {
    const user = await authService.myProfile(req.user.id);
    ApiResponse.ok(res, "this is your profile info.",user);
}



export {
  register,
  login,
  refreshToken,
  myProfile,
  logout,
 
 
};