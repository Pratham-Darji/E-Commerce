const mongoose = require("mongoose");
require("dotenv").config();

const userDbConnection = async () => {
  try {
    await mongoose.connect(process.env.userDB_URL);
    console.log("Database connected successfully");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = userDbConnection;
