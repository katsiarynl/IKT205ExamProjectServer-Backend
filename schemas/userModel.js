import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
  userId: String,
  email: String,
  addressLine1: String,
  addressLine2: String,
  city: String,
  state: String,
  zipCode: String,
});

const ApplicationUser = model("ApplicationUser", userSchema);

export { ApplicationUser };
