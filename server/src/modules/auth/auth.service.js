import ApiError from "../../common/utils/api-error.js";
import crypto from "crypto";
import {
  sendVerificationEmail,
  sendResetPasswordEmail,
} from "../../common/config/email.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  verifyAccessToken,
  generateResetToken,
} from "../../common/utils/jwt.utils.js";

// this function is for hashing. sagar you need to learn about this
const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");
import { db } from "../../common/config/db.js";
import { users } from "./auth.model.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const register = async ({ name, email, password }) => {

  // check existing user
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (existingUser.length > 0) {
    throw new Error("Email already exists.");
  };

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // insert user
  const newUser = await db
    .insert(users)
    .values({
      name,
      email,
      password: hashedPassword,
    })
    .returning();

  const userObj = newUser[0];
  delete userObj.password;

  return userObj;
};

const login = async ({ email, password }) => {

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (user.length === 0) {
    throw ApiError.unauthorized("Invalid Email or Password");
  }

  const logUser = user[0];
  // console.log("user", logUser);
  const comparePass = await bcrypt.compare(password, user[0].password);

  if (!comparePass) {
    throw ApiError.conflict("Invalid Email or Password");
  }

  console.log("login successfully!");

  const accessToken = generateAccessToken({
    id: logUser.id,
    email: logUser.email
  });

  const refreshToken = generateRefreshToken({ id: logUser.id });
  const hashRefreshToken = hashToken(refreshToken);

  const [res] = await db
    .update(users)
    .set({ refreshToken: hashRefreshToken })
    .where(eq(users.id, logUser.id)).returning()

    console.log("res",res)
    const finalUser = res;
    delete finalUser.password;
    delete finalUser.refreshToken;
    
    console.log("finalUSer",finalUser)
    return { user: finalUser, accessToken, refreshToken };
};

const logout = async (userId) => {
await db.update(users).set({refreshToken:null}).where(eq(users.id,userId));
};

// refreshToken needs to convert into Drizzle, currently its in mongoDB.
const refreshToken = async (token) => {
  if (!token) {
    throw ApiError.unauthorized("you are not authorized.");
  }

  const decodedToken = verifyRefreshToken(token);

  const user = await User.findById(decodedToken.id).select("+refreshToken");

  if (!user) {
    throw ApiError.unauthorized("user no longer exists");
  }

  if (user.refreshToken !== hashToken(token)) {
    throw ApiError.unauthorized("Invalid refresh token - please log in again");
  }

  const accessToken = generateAccessToken({ id: user._id, email: user.email });
  const refreshToken = generateRefreshToken({ id: user._id });

  user.refreshToken = hashToken(refreshToken);
  user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const myProfile = async (userId) => {
  if (!userId)
    throw ApiError.unauthorized("You are not valid for this request.");

  const [user] = await db.select().from(users).where(eq(users.id,userId));

  console.log("user in myProfile",user);
    delete user.password;
    delete user.refreshToken;
    delete user.resetPasswordToken;
    delete user.resetPasswordExpires;
  return { user:user };
};
export {
  register,
  login,
  refreshToken,
  logout,
  myProfile,
  
};
