import ApiError from "../../common/utils/api-error.js";
import {verifyAccessToken} from "../../common/utils/jwt.utils.js";
import users from "./auth.model.js";
import { db } from "../../common/config/db.js";
import { eq } from "drizzle-orm";

const isLoggedIn = async (req,res,next) => {
    let token ;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if(!token) throw ApiError.unauthorized("Invalid token");

    const decoded = verifyAccessToken(token);

    // console.log("in "decoded)

    const user = await db.select().from(users).where(eq(users.id,decoded.id)).limit(1);
    console.log("user in LoggedIn middleware",user)
    if(user.length === 0) throw ApiError.unauthorized("You are not authorized for this request.");

    req.user = {
        id:user[0].id,
        name:user[0].name,
        email:user[0].email,
        role:user[0].role
    }

    next()

}

export {isLoggedIn}