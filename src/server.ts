import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import { app } from "./routes";
const uri =
  "mongodb+srv://cook2goo:XmWKfcOOxtcXNTlu@cook2goo.yxylii0.mongodb.net/";
const PORT = process.env.PORT || 5000;
const start = async () => {
  try {
    await mongoose.connect(uri);
    app.listen(PORT, () => {
      console.log("listening on " + PORT);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
