import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import firebase from "firebase/compat/app";
import { Restraunt } from "../schemas/restrauntModel";

import "firebase/compat/database";
import auth from "../firebaseconfig";
import Stripe from "stripe";
const stripe = new Stripe(
  "sk_test_51MjtQyKZ0QuxsIgFuJ7CepFaI5NM0Ikf8uKOqQrNahb2sA0gPJzmPnjDtqCuPV4pO6Ze3RlKUpgGtjhykBD9Zx7g00oeNYI3l4",
  {
    apiVersion: "2022-11-15",
  }
);

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
  "mongodb+srv://cook2goo:XmWKfcOOxtcXNTlu@cook2goo.yxylii0.mongodb.net/";

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
