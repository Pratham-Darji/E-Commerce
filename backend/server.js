const express = require("express");
const userDbConnection = require("./config/userdbConnection");
const userRoutes = require("./routes/userRouters");
const productRoutes = require("./routes/productRouters");
const Product = require("./models/productSchema");

const cors = require("cors");
let app = express();

app.use(express.json());
app.use(cors());

userDbConnection();

// Registration Functionality
app.use("/api/users", userRoutes); // Public routes for registration and login
app.use("/api/product", productRoutes);

app.listen(8000);
