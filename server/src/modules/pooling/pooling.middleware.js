import ApiError from "../../common/utils/api-error.js";
import { verifyAccessToken } from "../../common/utils/jwt.utils.js";
import users from "../auth/auth.model.js";
import { db } from "../../common/config/db.js";
import { eq } from "drizzle-orm";
const optionalAuth = async (req, res, next) => {
  let token;

  if (
    !req.headers.authorization?.startsWith("Bearer") ||
    !req.headers.authorization
  ) {
    return next();
  }

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  try{
    const decoded = verifyAccessToken(token);

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.id))
      .limit(1);
    console.log("user in LoggedIn middleware", user);
    if (user.length === 0)
      throw ApiError.unauthorized("You are not authorized for this request.");

    req.user = {
      id: user[0].id,
      name: user[0].name,
      email: user[0].email,
    };

    console.log("req.user at optional auth middleware",req.user);

    next();
  }catch(e){
    return next()
  }
};

export { optionalAuth };
