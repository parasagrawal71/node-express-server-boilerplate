const moment = require("moment");
const jwt = require("jsonwebtoken");
const { errorResponse } = require('utils/response');
const UserModel = require("../api/v1/models/user.model");

/**
 * @description Function to authenticate requests
 */
module.exports.authenticateRequests = async (req, res, next) => {
  try {
    const token = req.headers.authorization && req.headers.authorization.substring(7);

    if (!token) {
      return errorResponse({ res, statusCode: 401, message: "Authentication failed: Token is required" });
    }

    const decoded = jwt.decode(token);

    if (!decoded) {
      return errorResponse({ res, statusCode: 401, message: "Authentication failed: Token is malformed!" });
    }

    // if (decoded && decoded.exp) {
    //   if (decoded.iss === "accounts.google.com" && moment(decoded.exp * 1000).isBefore()) {
    //     return errorResponse({ res, statusCode: 401, message: "Authentication failed: Token expired" });
    //   } else if (decoded.iss === "api-documenter.com" && moment(decoded.exp).isBefore()) {
    //     return errorResponse({ res, statusCode: 401, message: "Authentication failed: Token expired" });
    //   }
    // }

    const user = await UserModel.findOne({ email: decoded.email });
    if (!user) {
      return errorResponse({ res, statusCode: 401, message: "Authentication failed: User not registered" });
    }

    if (!user.isVerified) {
      return errorResponse({ res, statusCode: 401, message: "Authentication failed: User not verified" });
    }

    req.loggedInUser = user;
    next();
  } catch (error) {
    next(error);
  }
};
