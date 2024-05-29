const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
      validate: {
        validator: async function (email) {
          const user = await this.constructor.findOne({ email });
          return !user;
        },
        message: "Email is already registered",
      },
    },
    phone: {
      type: Number,
      require: true,
    },
    username: {
      type: String,
      require: true,
      unique: true,
      validate: {
        validator: async function (username) {
          const user = await this.constructor.findOne({ username });
          return !user;
        },
        message: "Username is already taken",
      },
    },
    password: {
      type: String,
      reequire: true,
    },
    accessToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    cart: [
      {
        product: {
          productId: { type: mongoose.Schema.Types.ObjectId, ref: "productId" },
          Qty: { type: Number },
        },
      },
    ],
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },

  {
    timestamps: true,
  }
);

let User = mongoose.model("User", userSchema);
module.exports = User;
