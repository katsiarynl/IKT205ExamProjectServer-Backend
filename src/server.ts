import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import firebase from "firebase/compat/app";
import { Restraunt } from "../schemas/restrauntModel";

import jwt from "jsonwebtoken";
import { initializeApp } from "firebase-admin";

import "firebase/compat/database";
//import auth from "../firebaseconfig";
// importing the auth from the main firebaseConfigPro

import { auth } from "../firebaseConfigPro";
import admin from "firebase-admin";
import serviceAccount from "../serviceAccount.json" assert { type: "json" };

const params = {
  type: serviceAccount.type,
  projectId: serviceAccount.project_id,
  privateKeyId: serviceAccount.private_key_id,
  privateKey: serviceAccount.private_key,
  clientEmail: serviceAccount.client_email,
  clientId: serviceAccount.client_id,
  authUri: serviceAccount.auth_uri,
  tokenUri: serviceAccount.token_uri,
  authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
  clientC509CertUrl: serviceAccount.client_x509_cert_url,
};

admin.initializeApp({
  credential: admin.credential.cert(params),
  databaseURL: "https://cooktogo-cec09-default-rtdb.firebaseio.com",
});

// Initialize the Admin App
// creating post api called isAuthenticated

import Stripe from "stripe";
const stripe = new Stripe(
  "sk_test_51MjtQyKZ0QuxsIgFuJ7CepFaI5NM0Ikf8uKOqQrNahb2sA0gPJzmPnjDtqCuPV4pO6Ze3RlKUpgGtjhykBD9Zx7g00oeNYI3l4",
  {
    apiVersion: "2022-11-15",
  }
);

import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const PORT = process.env.PORT || 5000;

// https://dev.to/deepakshisood/authentication-using-firebase-for-expressjs-2l48

const { Schema, model } = mongoose;

import { Blog } from "../schemas/blogModel";
import { ActivityIndicatorComponent } from "react-native";
import { Server } from "http";
import { async } from "@firebase/util";

//https://stackoverflow.com/questions/14588032/mongoose-password-hashing
//https://www.npmjs.com/package/bcrypt

const uri =
  "mongodb+srv://cook2goo:XmWKfcOOxtcXNTlu@cook2goo.yxylii0.mongodb.net/";

const app = express();
//app.use(helmet());
app.use(express.json());

// creating the post request to /SignUp
// https://firebase.google.com/docs/auth/web/email-link-auth
app.post("/signUp", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required!" });
  }
  try {
    createUserWithEmailAndPassword(auth, email, password)
      .then((newUserCredential) => {
        const newUser = newUserCredential.user;
        console.log(newUser);
        res.json({ message: "User Registered Successfully" });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error);
        res.status(400).json({ error: errorMessage });
      });
  } catch {
    res.status(500).json({ error: "internal server Error!" });
  }
});

app.get("/isAuthenticated", async (req, res) => {
  try {
    // Check if Authorization header is present and in the expected format
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Extract the ID token from the Authorization header
    const idToken = authHeader.split(" ")[1];

    // Verify ID token and get user info
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Return true if user is authenticated
    res.json({ isAuthenticated: true });
    console.log(idToken);
  } catch (error) {
    console.error(error);

    // Return false if user is not authenticated
    res.json({ isAuthenticated: false });
  }
});

// post request for the forgetPassword.
// https://firebase.google.com/docs/auth/web/email-link-auth
app.post("/forgetPassword", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ MessageError: "Email is required!" });
  }
  try {
    const userExists = await admin.auth().getUserByEmail(email);
    if (!userExists) {
      return res
        .status(404)
        .json({ MessageError: "User not found for that user!" });
    }
    const linkToReset = {
      // using our url passWord reset link, to be the link clickable.
      url: "https://cooktogo-cec09.firebaseapp.com/__/auth/action?mode=action&oobCode=code",
      handleCodeInApp: true,
    };
    await sendPasswordResetEmail(auth, email, linkToReset);
    console.log("Password reset email sent successfully to: ", email);

    res.json({
      message: "Link for password rest sent email Successfully!",
    });
  } catch (error: any) {
    console.log(error);

    res.status(400).json({ Error: error.message });
  }
});

app.post("/signIn", async (req, res) => {
  const { email, password } = req.body;

  // checking if the user post without email and password
  if (!email || !password) {
    return res.status(400).json({ error: "Email and Password is required!" });
  }

  try {
    signInWithEmailAndPassword(auth, email, password)
      .then(async (existingUser) => {
        const user = existingUser.user;
        console.log(user);

        const idToken = await user.getIdToken();
        console.log(idToken);

        res.json({
          accessToken: idToken,
          message: "User Signed In Successfully",
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error);
        res.status(400).json({ error: errorMessage });
      });
  } catch {
    res.status(500).json({ error: "internal Server Error!" });
  }
});

// post request for the Signout post

app.post("/singOut", async (req, res) => {
  try {
    await auth.signOut();
    res.json({ message: "user logged out Successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "internal Server Error! " });
  }
});

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

app.post("/v1/prices", async (req, res) => {
  //mongoose
  const price = await stripe.prices.create({
    unit_amount: 2000,
    currency: "nok",
    recurring: { interval: "month" },
    product: "prod_NUu2RGsnPGeRN4",
  });
  return res.status(200).json(price);
});
app.post("/v1/products", async (req, res) => {
  //mongoose
  const product = await stripe.products.create({
    name: "Gold NOT Special",
  });
  return res.status(200).json(product);
});

app.get("/create-checkout-session", async (req, res) => {
  console.log("hello");
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell

        quantity: 1,

        price: "price_1MjuErKZ0QuxsIgFG3P4dIkU",
      },
    ],
    currency: "nok",
    mode: "subscription",

    success_url: `http://localhost:5000/success`,
    cancel_url: `http://localhost:5000/cancel`,
  });
  const redirecturl = session.url || "http://localhost:5000";

  return res.status(200).json(redirecturl);
});

app.post("/create-checkout-session", async (req, res) => {
  console.log(req.body);

  console.log("--------------------");
  req.body.map((item) => console.log(item.id));

  const session = await stripe.checkout.sessions.create({
    line_items: req.body.map((item) => {
      return {
        price_data: {
          currency: "nok",
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.cartQuantity,
      };
    }),

    // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
    // invoice_creation: { enabled: true },

    currency: "nok",
    mode: "payment",
    success_url: `http://localhost:5000/success`,
    cancel_url: `http://localhost:5000/cancel`,
  });
  const redirecturl = session.url || "http://localhost:5000";
  console.log(res);
  return res.status(200).json(redirecturl);
});

app.use("/success", async (req, res) => {
  console.log("login");
  return res.status(200);
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
app.get("/restraunts", async (req, res) => {
  //mongoose
  const allRestraunts = await Restraunt.find();
  console.log(allRestraunts);
  return res.status(200).json(allRestraunts);
});

//GET request. path: localhost:5000/users/
app.get("/restraunt/:id", async (req, res) => {
  const { id } = req.params;
  const restraunt = await Restraunt.findById(id);
  return res.status(200).json(restraunt);
});

//DELETE request. path: localhost:5000/users/
app.delete("/blogs/:id", async (req, res) => {
  const { id } = req.params;
  const deleteBlog = await Blog.findByIdAndDelete(id);
  return res.status(200).json(deleteBlog);
});

app.post("/restraunts/", async (req, res) => {
  console.log("hello");
  const newRestraunt = new Restraunt({
    name: "String",
    address: "String",
    rating: 5,
    photos:
      "https://www.foodiesfeed.com/wp-content/uploads/2019/06/top-view-for-box-of-2-burgers-home-made-600x899.jpg",
    menu: [
      {
        category: "category1",
        meals: [
          { name: "String", price: 24, description: "String" },
          { name: "String1", price: 21, description: "String1" },
        ],
      },
      {
        category: "category1",
        meals: [
          { name: "String", price: 100, description: "String" },
          { name: "String1", price: 33, description: "String1" },
        ],
      },
    ],
  });
  const insertedRestraunt = await newRestraunt.save();
  return res.status(201).json(insertedRestraunt);
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
//respond when smth is updated
app.get("/update", async (req, res) => {
  //mongoose
  Blog.watch().on("change", async (data) => {
    console.log(data);

    const allBlogs = await Blog.find();
    console.log(allBlogs);
    return res.status(200).json(allBlogs);
  });
});
app.use((req, res, next) => {
  res.status(404).send(" mongodb");
});

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
