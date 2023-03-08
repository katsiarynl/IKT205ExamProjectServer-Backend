import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import auth from "../firebaseconfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const PORT = process.env.PORT || 5000;

// https://dev.to/deepakshisood/authentication-using-firebase-for-expressjs-2l48

const { Schema, model } = mongoose;
import { Blog } from "../schemas/blogModel";

//https://stackoverflow.com/questions/14588032/mongoose-password-hashing
//https://www.npmjs.com/package/bcrypt

const uri =
  "mongodb+srv://katsiarynl:6tZbx2OTW99ex9fd@cluster0.83jtahe.mongodb.net/?retryWrites=true&w=majority";

const app = express();
app.use(helmet());
app.use(express.json());

//POST localhost:5000/register
//POST request to register
app.post("/register", async (req, res) => {
  try {
    createUserWithEmailAndPassword(
      auth,
      "kaya.lobkovskaya@bk.ru",
      "katepassword22222"
    )
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
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

  signInWithEmailAndPassword(auth, "kate@nedenes.com", "katepassword22222")
    .then((userCredential) => {
      const user = userCredential.user;
    })
    .catch((error) => {
      throw error;
    });
  res.redirect("/");
});

// app.use((req, res, next) => {
//   const user = firebase.auth().currentUser;
//   res.locals.currentUser = user;
//   console.log(user);
//   next();
// });
// app.get("/logout", function (req, res) {
//   signOut(auth)
//     .then(() => {
//       res.redirect("/login");
//     })
//     .catch((error) => {
//       // An error happened.
//       throw error;
//     });
// });

//GET request to localhost:5000/users
app.get("/blogs", async (req, res) => {
  //mongoose
  const allBlogs = await Blog.find();
  console.log(allBlogs);
  return res.status(200).json(allBlogs);
});

//GET request. path: localhost:5000/users/
app.get("/blogs/:id", async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);
  return res.status(200).json(blog);
});

//DELETE request. path: localhost:5000/users/
app.delete("/blogs/:id", async (req, res) => {
  const { id } = req.params;
  const deleteBlog = await Blog.findByIdAndDelete(id);
  return res.status(200).json(deleteBlog);
});

app.post("/blogs/", async (req, res) => {
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
  const newBlog = new Blog({
    title: "Title",
    slug: "slug",

    author: "author",
    content: "content",
  });
  const insertedBlog = await newBlog.save();
  return res.status(201).json(insertedBlog);
});

app.put("/blogs/:id", async (req, res) => {
  const { id } = req.params;
  // console.log(req.body);
  const InsertedBlog = new Blog({
    title: "String",
    slug: "String",
    published: "Boolean",
    author: "String",
    content: "String",
  });

  await Blog.findByIdAndUpdate(id, req.body);
  //await Blog.findByIdAndUpdate(id, { InsertedBlog });
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
    app.listen(process.env.PORT || 5000);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
