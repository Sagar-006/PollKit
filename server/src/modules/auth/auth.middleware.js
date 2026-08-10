import ApiError from "../../common/utils/api-error.js";
import { verifyAccessToken } from "../../common/utils/jwt.utils.js";
import users from "./auth.model.js";
import { db } from "../../common/config/db.js";
import { eq } from "drizzle-orm";

const isLoggedIn = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.status(419).json({
      success: false,
      message: "Access token missing",
    });
  }

  try {
    const decoded = verifyAccessToken(accessToken);

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.id))
      .limit(1);

    if (!user) {
      return next(
        ApiError.unauthorized("You are not authorized for this request."),
      );
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (e) {
    if (e.name === "TokenExpiredError") {
      return res.status(419).json({
        success: false,
        message: "Access token expired",
      });
    }

    if (e.name === "JsonWebTokenError") {
      return next(ApiError.unauthorized("Invalid access token"));
    }

    return next(e);
  }
};

export { isLoggedIn };
