require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = function validateJwtt(req, res, next) {
   const accessToken = req.header("x-auth-token");
   if (!accessToken) {
      return res.status(401).json({ auth: "No token provided." });
   }
   try {
      // verify the token
      // if valid, extract the user payload
      // test update
      const decodedPayload = jwt.verify(
         accessToken,
         process.env.JWT_ACCESS_SECRET
      );
      // assigning the payload to the request
      req.user = decodedPayload;
      // continue on in the API
      next();
   } catch {
      return res.status(401).json({ auth: "Unauthorized token." });
   }
};
