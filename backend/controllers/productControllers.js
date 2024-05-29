const Product = require("../models/productSchema");
0;
const productSchema = require("../models/productSchema");

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, type, imageUrl } = req.body;
    const product = new Product({ name, description, price, type, imageUrl });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getData = async (req, res) => {
  const data = await productSchema.find();
  res.status(200).send(data);
};

exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    // console.log(productId);

    await productSchema.findByIdAndDelete(productId);
    res.status(200).json("Deleted Successfully");
  } catch (error) {
    console.log(error);
  }
};

exports.editProduct = async (req, res) => {
  try {
    const { id, name, description, price, type } = req.body;

    await productSchema.findByIdAndUpdate(
      id,
      {
        $set: {
          name: name,
          description: description,
          price: price,
          type: type,
        },
      },
      { new: true }
    );
    res.status(200).json("Data Updated Suceesfully");
  } catch (error) {
    console.log(error);
  }
};
