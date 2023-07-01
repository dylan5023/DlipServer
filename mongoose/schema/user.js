const mongoose = require("mongoose");
const crpyto = require("crypto");
const Schema = mongoose.Schema;

const User = new Schema({
  email: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  salt: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  nickname: { type: String, required: true, unique: true },
  company: { type: Schema.Types.ObjectId, ref: "Company" },
});

// virtual of password
User.virtual("password").set(function (password) {
  this._password = password;
  this.salt = this.makeSalt();
  this.hashedPassword = this.encryptPassword(password);
});

//  create a new salt
User.method("makeSalt", function () {
  return Math.round(new Date().valueOf() * Math.random()) + "Hello Dylank";
});

// create the hased password
User.method("encryptPassword", function (plainPassword) {
  return crpyto
    .createHmac("sha256", this.salt)
    .update(plainPassword)
    .digest("hex");
});

// authenticate of user
User.method("authenticate", function (plainPassword) {
  const inputPassword = this.encryptPassword(plainPassword);

  return inputPassword === this.hashedPassword;
});

module.exports = User;
