const mongoose = require("mongoose");
const express = require("express");

const userSchema = require("../models/userSchema");
const productSchema = require("../models/productSchema");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");

let app = express();

app.use(express.json());

// Empty Array to storage Refresh Token
let refreshTokens = [];
let loggedInUser;
let loggedInUserRole;
// Generate access token secret
const ACCESS_TOKEN_SECRET = crypto.randomBytes(64).toString("hex");

// Generate refresh token secret
const REFRESH_TOKEN_SECRET = crypto.randomBytes(64).toString("hex");

exports.registerUser = async (req, res) => {
  const { name, email, phone, username, password, role } = req.body;
  try {
    const register = new userSchema({
      name,
      email,
      phone,
      username,
      password,
      role,
    });
    await register.save();
    let id = register["_id"];
    res.status(200).json(`User added at id: ${id}`);
  } catch (error) {
    if (error.errors.email.message == "Email is already registered") {
      return res.status(400).send("Email is already registered");
    }

    if (error.errors.username.message == "Username is already taken") {
      return res.status(400).send("Username is already taken");
    }

    res.status(400).send(error);
  }
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await userSchema.findOne({ username, password });
    if (user) {
      // Generating Access Token
      let accessToken = jwt.sign({ username: username }, ACCESS_TOKEN_SECRET, {
        expiresIn: "25m",
      });

      // Generating Refresh Token
      let refreshToken = jwt.sign(
        { username: username, password: password },
        REFRESH_TOKEN_SECRET
      );
      loggedInUser = username;
      loggedInUserRole = user.role;
      refreshTokens.push(refreshToken);

      const tokens = await userSchema.findOneAndUpdate(
        { username: username },
        { $set: { accessToken: accessToken, refreshToken: refreshToken } },
        { new: true }
      );

      res.status(200).json({
        username,
        password,
        accessToken,
        refreshToken,
        loggedInUserRole,
      });
    } else {
      res.status(404).send("Invalid Username or Password");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

// exports.refreshToken = async (req, res) => {
//   const username = req.body.username;
//   let dbRefreshToken = await userSchema.find();
//   let refreshToken;
//   let accessToken;

//   dbRefreshToken.forEach(async (e) => {
//     if (e.username == username) {
//       refreshToken = e.refreshToken;
//       jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
//         if (err) {
//           return res.status(403).send(err); // Forbidden
//         }

//         accessToken = jwt.sign(
//           { username: user.username, password: user.password },
//           ACCESS_TOKEN_SECRET,
//           {
//             expiresIn: "25m",
//           }
//         );
//         res.json({ accessToken });
//       });

//       const tokens = await userSchema.findOneAndUpdate(
//         { username: e.username },
//         { $set: { accessToken: accessToken } },
//         { new: true }
//       );
//     }
//   });
// };

exports.Authenticate = async (req, res, next) => {
  let dbAccessToken = await userSchema.find();

  let accessToken;
  dbAccessToken.forEach((e) => {
    if (e.username == loggedInUser) {
      accessToken = e.accessToken;
    }
  });
  jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;
    next();
  });
};

exports.posts = (req, res) => {
  try {
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

exports.cartId = async (req, res) => {
  try {
    const { productId } = req.body;

    // Find the user in the database
    const user = await userSchema.findOne({ username: loggedInUser });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let updatedUser;

    // Check if the product already exists in the cart
    const existingProductIndex = user.cart.findIndex(
      (item) => item.product.productId.toString() === productId.toString()
    );

    if (existingProductIndex !== -1) {
      // If product already exists, update the quantity
      user.cart[existingProductIndex].product.Qty += 1;
    } else {
      // If product does not exist, add it to the cart with quantity 1
      user.cart.push({ product: { productId: productId, Qty: 1 } });
    }

    // Update the user document in the database
    updatedUser = await userSchema.findOneAndUpdate(
      { username: loggedInUser },
      { cart: user.cart },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.userInfo = async (req, res) => {
  try {
    let dbConnection = await userSchema.find();

    const user = await userSchema.findOne({ username: loggedInUser });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.accessToken == "") {
      return res.status(404).json({ error: "User not found" });
    }

    dbConnection.forEach((e) => {
      if (loggedInUser == e.username) {
        res.status(200).send(e);
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.viewCart = async (req, res) => {
  try {
    let dbConnection = await userSchema.find();

    dbConnection.forEach((e) => {
      if (loggedInUser == e.username) {
        res.status(200).json(e.cart);
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.logout = async (req, res) => {
  try {
    let dbConnection = await userSchema.find();

    dbConnection.forEach(async (e) => {
      if (loggedInUser == e.username) {
        // e.accessToken = "";
        accessToken = e.accessToken;

        id = e._id;

        await userSchema.findByIdAndUpdate(id, { accessToken: "" });

        res.status(200).json("Logout Successfully");
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteQty = async (req, res) => {
  try {
    const { productId } = req.body;
    // console.log(productId);
    const user = await userSchema.findOne({ username: loggedInUser });

    // user.cart[existingProductIndex].product.Qty += 1;

    const existingProductIndex = user.cart.findIndex(
      (item) => item.product.productId.toString() === productId.toString()
    );

    let updatedUser;
    if (existingProductIndex !== -1) {
      // If product already exists, update the quantity
      user.cart[existingProductIndex].product.Qty -= 1;

      if (user.cart[existingProductIndex].product.Qty == 0) {
        user.cart.splice(existingProductIndex, 1);
      }

      updatedUser = await userSchema.findOneAndUpdate(
        { username: loggedInUser },
        { cart: user.cart },
        { new: true }
      );

      res.status(200).send(updatedUser);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

exports.addProduct = async (req, res) => {
  try {
    const {
      productName,
      productDescription,
      productPrice,
      productType,
      imageUrl,
    } = req.body;

    const product = new productSchema({
      name: productName,
      description: productDescription,
      price: productPrice,
      type: productType,
      imageUrl: imageUrl,
    });

    await product.save();
    res.status(200).json({ message: "Product Added Successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};
