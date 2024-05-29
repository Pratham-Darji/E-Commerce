// userRoutes.js
const express = require("express");
const router = express.Router();
const productController = require("../controllers/productControllers");
const userController = require("../controllers/userControllers");

router.get("/data", userController.Authenticate, productController.getData);

router.post(
  "/deleteProduct",
  userController.Authenticate,
  productController.deleteProduct
);

router.post(
  "/editProduct",
  userController.Authenticate,
  productController.editProduct
);

module.exports = router;
