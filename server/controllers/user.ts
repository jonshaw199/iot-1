import userModel from "../models/user";
import { Response } from "express";
import jwt from "jsonwebtoken";
import { Document } from "mongoose";

import { User, Request } from "../types";

// list users
export const index = (req, res) => {
  userModel.find(req.body, (err, users) => {
    res.json(users);
  });
};

// get one user
export const show = (req, res) => {
  console.log("Current User:");
  console.log(req.user);
  userModel.findById(req.params.id, (err, user) => {
    res.json(user);
  });
};

// create a new user
export const create = (req, res) => {
  userModel.create(req.body, (err, user) => {
    if (err) return res.json({ success: false, code: err.code });
    // once user is created, generate a token to "log in":
    const token = signToken(user);
    res.json({
      success: true,
      msg: "User created. Token attached.",
      token,
      user,
    });
  });
};

// update an existing user
export const update = (req, res) => {
  userModel.findById(req.params.id, (err, user) => {
    Object.assign(user, req.body);
    user.save((err, updatedUser) => {
      res.json({ success: true, msg: "User updated.", user });
    });
  });
};

// delete an existing user
export const destroy = (req, res) => {
  userModel.findByIdAndRemove(req.params.id, (err, user) => {
    res.json({ success: true, msg: "User deleted.", user });
  });
};

// the login route
export const authenticate = (req, res) => {
  // check if the user exists
  userModel.findOne({ email: req.body.email }, (err, user) => {
    // if there's no user or the password is invalid
    if (!user || !user.validPassword(req.body.password)) {
      // deny access
      return res.json({ success: false, msg: "Invalid credentials." });
    }

    const token = signToken(user);
    res.json({ success: true, msg: "Token attached.", token, user });
  });
};

// Same logic as above, but this route goes through verifyToken middleware
export const authWithToken = (req, res) => {
  // check if the user exists
  userModel.findOne({ email: req.user?.email }, (err, user) => {
    // if there's no user or the password is invalid
    if (!user) {
      // deny access
      return res.json({ success: false, msg: "Token user not found." });
    }
    res.json({ success: true, msg: "Token attached.", token: req.token, user });
  });
};

const { JWT_SECRET } = process.env;

// function for creating tokens
export function signToken(user: Document<User>) {
  // toObject() returns a basic js object with only the info from the db
  const userData = user.toObject();
  delete userData.password;
  return jwt.sign(userData, JWT_SECRET, { expiresIn: "365d" });
}

// function for verifying tokens
export function verifyToken(req: Request, res: Response, next) {
  // grab token from either headers, req.body, or query string
  const token = req.get("token") || req.body.token || req.query.token;
  // Easy access later
  req.token = token;
  // if no token present, deny access
  if (!token) return res.json({ success: false, msg: "No token provided" });
  // otherwise, try to verify token
  jwt.verify(token, JWT_SECRET, (err, decodedData) => {
    // if problem with token verification, deny access
    if (err) return res.json({ success: false, msg: "Invalid token." });
    // otherwise, search for user by id that was embedded in token
    userModel.findById(decodedData._id, (err, user) => {
      // if no user, deny access
      if (!user) return res.json({ success: false, msg: "Invalid token." });
      // otherwise, add user to req object
      req.user = user;
      // go on to process the route:
      next();
    });
  });
}
