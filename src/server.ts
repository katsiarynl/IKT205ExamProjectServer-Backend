const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const helmet = require("helmet");
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";

const firebaseConfig = {
  apiKey: "AIzaSyDhnMMEDN9PRPmpwMNjZE-lklN5b19RjEA",
  authDomain: "studentfirebase-8c937.firebaseapp.com",
  projectId: "studentfirebase-8c937",
  storageBucket: "studentfirebase-8c937.appspot.com",
  messagingSenderId: "618125972867",
  appId: "1:618125972867:web:045e3cb90866f9f5d552b6",
  measurementId: "G-8Y29BN65XN",
};

firebase.initializeApp(firebaseConfig);

// https://dev.to/deepakshisood/authentication-using-firebase-for-expressjs-2l48
const bcrypt = require("bcrypt");
const { Schema, model } = mongoose;
import { Blog } from "../schemas/blogModel";
import { ApplicationUser } from "../schemas/userModel";
//https://stackoverflow.com/questions/14588032/mongoose-password-hashing
//https://www.npmjs.com/package/bcrypt

const uri =
  "mongodb+srv://katsiarynl:6tZbx2OTW99ex9fd@cluster0.83jtahe.mongodb.net/?retryWrites=true&w=majority";

const app = express();
app.use(helmet());
app.use(express.json());

app.post("/register", async (req, res) => {
  try {
    firebase
      .auth()
      .createUserWithEmailAndPassword(
        "lobkovskaya@icloud.com",
        "katepassword22222"
      )
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error);
      });
    res.redirect("/");
  } catch (e) {
    res.redirect("register");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("login");
  firebase
    .auth()
    .signInWithEmailAndPassword("kate@nedenes.com", "katepassword22222")
    .then((userCredential) => {
      var user = userCredential.user;
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
    });
  res.redirect("/");
});

app.use((req, res, next) => {
  var user = firebase.auth().currentUser;
  res.locals.currentUser = user;
  console.log(user);
  next();
});
app.get("/logout", function (req, res) {
  firebase
    .auth()
    .signOut()
    .then(() => {
      res.redirect("/login");
    })
    .catch((error) => {
      // An error happened.
    });
});

app.get("/users", async (req, res) => {
  const allUsers = await ApplicationUser.find();
  console.log(allUsers);
  return res.status(200).json(allUsers);
});

app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const blog = await ApplicationUser.findById(id);
  return res.status(200).json(blog);
});

app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  const deletedUser = await ApplicationUser.findByIdAndDelete(id);
  return res.status(200).json(deletedUser);
});

app.post("/users/", async (req, res) => {
  const date = new Date();
  //https://stackoverflow.com/questions/3552461/how-do-i-format-a-date-in-javascript
  const datestring =
    date.getDate() +
    "-" +
    (date.getMonth() + 1) +
    "-" +
    date.getFullYear() +
    " ";
  console.log(datestring);
  const newUser = new ApplicationUser({
    firstName: "Kate",
    lastName: "LAstName",
    email: "email",
    password: "lalalalala",
    createdAt: datestring,
  });
  const insertedUser = await newUser.save();
  return res.status(201).json(insertedUser);
});

app.put("/blogs/:id", async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  await Blog.findByIdAndUpdate(id, req.body);
  const updatedBlog = await Blog.findById(id);
  console.log(updatedBlog);
  return res.status(200).json(updatedBlog);
});

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

const start = async () => {
  try {
    await mongoose.connect(uri);
    app.listen(5000, () => console.log("Server started on port 5000"));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
