// userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers");

// POST /api/users/register
router.post("/register", userController.registerUser);

// POST /api/users/login
router.post("/login", userController.loginUser);

router.post("/cartId", userController.cartId);

router.get("/userInfo", userController.userInfo);

router.get("/viewCart", userController.viewCart);

router.get("/logout", userController.logout);

router.post("/deleteQty", userController.deleteQty);

router.post("/addProduct", userController.addProduct);

module.exports = router;
