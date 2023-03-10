const User = require("../models/user");
const { check, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var expressJwt = require("express-jwt");


exports.signup = (req, res) => {
const errors = validationResult(req);

if(!errors.isEmpty()){
  return res.status(422).json({
    error : errors.array()[0].msg
  });
}

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "NOT able to save user in DB"
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id
    });
  });
};

exports.signin = (req, res) => {
  const errors = validationResult(req);
  const { email, encry_password } = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg
    });
  }

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "USER email does not exists"
      });
    }

    if (!user.autheticate(encry_password)) {
   console.log( "checkpoint")
      return res.status(401).json({
        error: "Email and encry_password do not match"
      })
    }

    //create token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    //put token in cookie
    res.cookie("token", token, { expireS: new Date(Date.now() + 9999 )});

    //send response to front end
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, name, email, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signout succesfully"
  });
};
//PROTECTED ROUTES
exports.isSignedIn= expressJwt({
  secret : process.env.SECRET,
  userProperty: "auth"
});

//custom middelware
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED"
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  //role = 0 means he is regular user not admin
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "You are not ADMIN, Access denied"
    });
  }
  next();
};
