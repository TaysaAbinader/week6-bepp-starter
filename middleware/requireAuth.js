const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const requireAuth = async (req, res, next) => {
  // verify user is authenticated
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  console.log(authorization);
  console.log(authorization.split(" "));
  console.log(authorization.split(" ")[0]);
  console.log(authorization.split(" ")[1]);

  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.SECRET);

    //Iteration 3 (explanation):
    //It finds the user ID on the database based on the token;
    //Removes all extra fields (check only the ID);
    //Attaches the user's ID to the request, which protects routes so you know who is making the request.
    req.user = await User.findOne({ _id }).select("_id");
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Request is not authorized" });
  }
};

module.exports = requireAuth;
