import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
  userId: String,
});

const ApplicationUser = model("ApplicationUser", userSchema);

export { ApplicationUser };
