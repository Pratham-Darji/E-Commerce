const mongoose = require("mongoose");
const express = require("express");

const userDbConnection = require("./config/userdbConnection");
const userSchema = require("./models/userSchema");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const cors = require("cors");
const { access } = require("fs");
let app = express();

app.use(express.json());
app.use(cors());

userDbConnection();

// Empty Array to storage Refresh Token
let refreshTokens = [];
let loggedInUser;

// Posts
let posts = [
  {
    id: 1,
    title: "Post 1",
    content: "Content of Post 1",
  },
  { id: 2, title: "Post 2", content: "Content of Post 2" },
  {
    id: 3,
    title: "Post 3",
    content: "Content of Post 3",
  },
];

// Generate access token secret
const ACCESS_TOKEN_SECRET = crypto.randomBytes(64).toString("hex");

// Generate refresh token secret
const REFRESH_TOKEN_SECRET = crypto.randomBytes(64).toString("hex");

// Registration Functionality
app.post("/register", async (req, res) => {
  const { name, email, phone, username, password } = req.body;
  try {
    const register = new userSchema({ name, email, phone, username, password });
    await register.save();
    let id = register["_id"];
    res.status(200).send(`User added at id: ${id}`);
  } catch (error) {
    if (error.errors.message == "Email is already registered") {
      return res.status(409).send("Email is already registered");
    }

    if (error.errors.username.message == "Username is already taken") {
      return res.status(409).send("Username is already taken");
    }

    res.status(400).send(error);
  }
});

// Login Functionality
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await userSchema.findOne({ username, password });
    if (user) {
      // Generating Access Token
      let accessToken = jwt.sign({ username: username }, ACCESS_TOKEN_SECRET, {
        expiresIn: "25s",
      });

      // Generating Refresh Token
      let refreshToken = jwt.sign(
        { username: username, password: password },
        REFRESH_TOKEN_SECRET
      );
      loggedInUser = username;
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
      });
    } else {
      res.status(404).send("Invalid Username or Password");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

async function Authenticate(req, res, next) {
  // const username = req.body.username;
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
}

// Accessing Post with Valid accessToken
app.get("/posts", Authenticate, (req, res) => {
  res.json(posts);
  console.log(posts);
});

app.get("/refresh", async (req, res) => {
  const username = req.body.username;
  let dbRefreshToken = await userSchema.find();
  let refreshToken;
  let accessToken;

  dbRefreshToken.forEach(async (e) => {
    if (e.username == username) {
      refreshToken = e.refreshToken;
      jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
          return res.status(403).send(err); // Forbidden
        }

        accessToken = jwt.sign(
          { username: user.username, password: user.password },
          ACCESS_TOKEN_SECRET,
          {
            expiresIn: "25s",
          }
        );
        res.json({ accessToken });
      });

      const tokens = await userSchema.findOneAndUpdate(
        { username: e.username },
        { $set: { accessToken: accessToken } },
        { new: true }
      );
    }
  });
});

app.listen(8000);
