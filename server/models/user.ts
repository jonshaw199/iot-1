import mongoose from "mongoose";
import bcrypt from "bcrypt-nodejs";

import { User } from "../types";

const userSchema = new mongoose.Schema<User>({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: "Org" },
});

// adds a method to a user document object to create a hashed password
userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

// adds a method to a user document object to check if provided password is correct
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// middleware: before saving, check if password was changed,
// and if so, encrypt new password before saving:
userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.password = userSchema.methods.generateHash(this.password);
  }
  next();
});

const userModel = mongoose.model<User>("User", userSchema);

export default userModel;
