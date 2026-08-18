import * as authService from "./auth.service.js";
import User from "./auth.model.js";
import ApiResponse from "../../common/utils/api-response.js";
import cookie from "cookie-parser";
import ApiError from "../../common/utils/api-error.js";
const register = async (req, res) => {
  const user = await authService.register(req.body);

  ApiResponse.created(res, "registration successfully", user);
};

const login = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.login(
      req.body,
    );

    ApiResponse.ok(res, "Login successfully", {
      user,
      accessToken,
      refreshToken,
    });
  } catch (e) {
    next(e); // 
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return next(ApiError.unauthorized("No refresh token"));
    }
    const { accessToken, refreshToken } = await authService.refreshToken(token);

    ApiResponse.ok(res, "Token refreshed", {
      accessToken,
      refreshToken,
    });
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res) => {
  await authService.logout(req.user.id);
  ApiResponse.ok(res, "Logged out successfully");
};

const myProfile = async (req, res) => {
  const user = await authService.myProfile(req.user.id);
  ApiResponse.ok(res, "this is your profile info.", user);
};

export { register, login, refreshToken, myProfile, logout };
