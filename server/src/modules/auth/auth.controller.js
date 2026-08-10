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

    // console.log(refreshToken, "refreshToken");
    // console.log(accessToken, "accessToken");
    // console.log(user, "user");

    // res.cookie("accessToken", accessToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production", // ✅ false in dev
    //   sameSite: "strict",
    //   maxAge: 30 * 1000,
    // });

    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   maxAge: 60 * 1000,
    // });

    ApiResponse.ok(res, "Login successfully", {
      user,
      accessToken,
      refreshToken,
    });
  } catch (e) {
    next(e); // ✅ passes ApiError to global error handler → returns JSON
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return next(ApiError.unauthorized("No refresh token"));
    }
    const { accessToken, refreshToken } = await authService.refreshToken(token);

    // res.cookie("accessToken", accessToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   maxAge: 30 * 1000, // 5 min
    // });

    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   maxAge: 60 * 1000, // 10 min
    // });

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
