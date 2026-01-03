import jwt from "jsonwebtoken";

/* ================= AUTH ================= */
export const auth = async (req, res, next) => {
  try {
    // token can come from cookies (browser), body (mobile), or Authorization header
    const token =
      req.cookies?.token ||
      req.body?.token ||
      req.header("Authorization")?.replace("Bearer ", "");

    // if token is missing, user is not authenticated
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    // verify token using secret key
    // if token is invalid or expired, jwt.verify will throw error
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded contains user payload like id, email, accountType
    // attaching it to req so next middlewares/controllers can use it
    req.user = decoded;

    // allow request to move forward
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

/* ================= IS STUDENT ================= */
export const isStudent = (req, res, next) => {
  try {
    // accountType is taken from decoded JWT payload
    if (req.user.accountType !== "student") {
      return res.status(403).json({
        success: false,
        message: "This route is accessible only to students",
      });
    }

    // user is student → allow access
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authorization failed",
    });
  }
};

/* ================= IS INSTRUCTOR ================= */
export const isInstructor = (req, res, next) => {
  try {
    // used for routes like course creation
    if (req.user.accountType !== "instructor") {
      return res.status(403).json({
        success: false,
        message: "This route is accessible only to instructors",
      });
    }

    // user is instructor → allow access
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authorization failed",
    });
  }
};

/* ================= IS ADMIN ================= */
export const isAdmin = (req, res, next) => {
  try {
    // admin-only routes like platform management
    if (req.user.accountType !== "admin") {
      return res.status(403).json({
        success: false,
        message: "This route is accessible only to admins",
      });
    }

    // user is admin → allow access
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authorization failed",
    });
  }
};
