const mongoose = require("mongoose");
const Users = require("./user.model");
const productsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: String, required: true },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
});

module.exports = mongoose.model("products", productsSchema);
