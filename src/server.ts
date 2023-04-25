import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import { Restraunt } from "../schemas/restrauntModel";
import nodemailer from "nodemailer";
import { storage } from "../firebaseConfigPro";
import { getDownloadURL, ref } from "firebase/storage";
//https://blog.jscrambler.com/getting-started-with-react-navigation-v6-and-typescript-in-react-native

import "firebase/compat/database";
//import auth from "../firebaseconfig";
// importing the auth from the main firebaseConfigPro

import { auth } from "../firebaseConfigPro";
import admin from "firebase-admin";
// @ts-ignore
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

import { ApplicationUser } from "../schemas/userModel";

import { basicAuthCred } from "./types";
import { error } from "console";

//https://stackoverflow.com/questions/14588032/mongoose-password-hashing
//https://www.npmjs.com/package/bcrypt

const uri =
  "mongodb+srv://cook2goo:XmWKfcOOxtcXNTlu@cook2goo.yxylii0.mongodb.net/";

export const app: Express = express();
app.use(helmet());
app.use(express.json());

// creating the post request to /SignUp
// https://firebase.google.com/docs/auth/web/email-link-auth
app.post("/signUp", async (req: Request, res: Response) => {
  const { email, password }: basicAuthCred = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required!" });
  }
  try {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (newUserCredential) => {
        const newUser = newUserCredential.user;
        // console.log(newUser);
        res.json({ message: "User Registered Successfully", id: newUser.uid });
        const newAppUser = new ApplicationUser({
          userId: newUser.uid,
        });
        console.log("user is");
        console.log(newAppUser);
        const insertedApplicationUser = await newAppUser.save();
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
app.post("/image", async (req: Request, res: Response) => {
  const { path }: { path: string } = req.body;
  try {
    const url = await getDownloadURL(ref(storage, path));

    return res.status(200).json(url);
  } catch (error) {
    console.error(error);
  }
});

app.get("/isAuthenticated", async (req: Request, res: Response) => {
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
app.post("/forgetPassword", async (req: Request, res: Response) => {
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

app.post("/signIn", async (req: Request, res: Response) => {
  const { email, password }: basicAuthCred = req.body;

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

app.post("/singOut", async (_: Request, res: Response) => {
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
app.post("/register", async (_: Request, res: Response) => {
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
        console.error(error.code);
        console.error(error.message);
        console.error(error);
      });
    res.redirect("/");
  } catch (e) {
    res.redirect("register");
  }
});

app.post("/create-checkout-session", async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    console.error(error);
    console.log("catched");

    res.status(400).json({ error: "Invalid parameters" });
  }
});

app.post("/nodemailer", async (req: Request, res: Response) => {
  console.log("Email sender...");
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "cook2goo@gmail.com",
      pass: "bcppfbtcashrfalc",
    },
  });

  const mailOptions = {
    from: "cook2goo@gmail.com",
    to: "lobkovskaya@icloud.com",
    subject: "Payment Confirmation",
    text: "Dear customer, payment was successful! Order details:",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error(error);
      return res.status(400).json({ Error: "Email error, could not be sent" });
    } else {
      console.log("Epost : " + info.response);
    }
  });
  return res.status(200).json(mailOptions);
});

app.use("/success", async (_, res: Response) => {
  console.log("login");
  return res.status(200);
});
app.post("/login", async (req: Request, res: Response) => {
  const { email, password }: basicAuthCred = req.body;
  console.log("login");

  signInWithEmailAndPassword(auth, "kate@nedenes.com", "katepassword22222")
    .then((userCredential) => {
      // todo: complite this
      const user = userCredential.user;
    })
    .catch((error) => {
      throw error;
    });
  res.redirect("/");
});



//GET request to localhost:5000/users
app.get("/restraunts", async (_, res: Response) => {
  //mongoose
  const allRestraunts = await Restraunt.find();
  console.log(allRestraunts);
  return res.status(200).json(allRestraunts);
});

//GET request. path: localhost:5000/users/
app.get("/restraunt/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const restraunt = await Restraunt.findById(id);
  return res.status(200).json(restraunt);
});

app.post("/restraunts/", async (_, res: Response) => {
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
          { name: "String", price: 22, description: "String" },
          { name: "String1", price: 33, description: "String1" },
        ],
      },
    ],
  });
  const insertedRestraunt = await newRestraunt.save();
  return res.status(201).json(insertedRestraunt);
});

const start = async () => {
  try {
    await mongoose.connect(uri);
    app.listen(PORT, async () => {
      await console.log("listening on " + PORT);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

app.use((_: Request, res: Response) => {
  res.status(404).send(" mongodb");
});

start();

