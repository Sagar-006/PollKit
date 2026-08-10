import ApiError from "../../common/utils/api-error.js";
import { verifyAccessToken } from "../../common/utils/jwt.utils.js";
import users from "../auth/auth.model.js";
import { db } from "../../common/config/db.js";
import { eq } from "drizzle-orm";
const optionalAuth = async (req, res, next) => {
      const token = req.cookies.accessToken;

  if (!token) {
    req.user = null;
    return next();
  }

  try{
    const decoded = verifyAccessToken(token);

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.id))
      .limit(1);

      req.user = user || null;


  }catch(e){
    req.user = null;
  }
  next();
};

export { optionalAuth };
