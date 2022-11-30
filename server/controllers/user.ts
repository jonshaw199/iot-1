import userModel from "../models/user";
import { Response } from "express";
import jwt from "jsonwebtoken";
import { Document, Error } from "mongoose";

import { User, Request } from "../types";

// list users
export const index = (req, res) => {
  userModel.find(req.body, (err: Error, users) => {
    if (err) return res.status(500).json({ msg: err.message });
    res.json({ users });
  });
};

// get one user
export const show = (req, res) => {
  console.log("Current User:");
  console.log(req.user);
  userModel.findById(req.params.id, (err: Error, user) => {
    if (err) return res.status(500).json({ msg: err.message });
    res.json({ user });
  });
};

// create a new user
export const create = (req, res) => {
  userModel.create(req.body, (err: Error, user) => {
    if (err) return res.status(500).json({ msg: err.message });
    // once user is created, generate a token to "log in":
    const token = signToken(user);
    res.json({
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
    user.save((err: Error, updatedUser) => {
      if (err) {
        return res.status(500).json({ msg: err.message });
      }
      res.json({ msg: "User updated.", updatedUser });
    });
  });
};

// delete an existing user
export const destroy = (req, res) => {
  userModel.findByIdAndRemove(req.params.id, (err: Error, user) => {
    if (err) return res.status(500).json({ msg: err.message });
    res.json({ msg: "User deleted.", user });
  });
};

// the login route
export const authenticate = (req, res) => {
  // check if the user exists
  userModel.findOne({ email: req.body.email }, (err: Error, user) => {
    // if there's no user or the password is invalid
    if (!user || !user.validPassword(req.body.password)) {
      // deny access
      return res.status(400).json({ msg: "Invalid credentials." });
    }
    if (err) {
      return res.status(500).json({ msg: err.message });
    }

    const token = signToken(user);
    res.json({ msg: "Token attached.", token, user });
  });
};

// Same logic as above, but this route goes through verifyToken middleware
export const authWithToken = (req, res) => {
  // check if the user exists
  userModel.findOne({ email: req.user?.email }, (err: Error, user) => {
    // if there's no user or the password is invalid
    if (!user) {
      // deny access
      return res
        .status(400)
        .json({ success: false, msg: "Token user not found." });
    }
    res.json({ msg: "Token attached.", token: req.token, user });
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
  if (!token) return res.status(400).json({ msg: "No token provided" });
  // otherwise, try to verify token
  jwt.verify(token, JWT_SECRET, (err: Error, decodedData) => {
    // if problem with token verification, deny access
    if (err) return res.status(400).json({ msg: "Invalid token." });
    // otherwise, search for user by id that was embedded in token
    userModel.findById(decodedData._id, (err, user) => {
      // if no user, deny access
      if (!user) return res.status(400).json({ msg: "Invalid token." });
      // otherwise, add user to req object
      req.user = user;
      // go on to process the route:
      next();
    });
  });
}
