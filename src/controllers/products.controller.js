const express = require("express");

const router = express.Router();

const Products = require("../models/products.model");

const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const redis = require("../configs/redis");
router.post("/", async function (req, res) {
  const item = await Products.create(req.body);
  const allproducts = await Products.find().lean().exec();
  redis.set("allProducts", JSON.stringify(allproducts));
  // const user = req.user;

  return res.send({ item });
});

router.get(
  "/",
  authenticate,
  authorize(["admin", "seller", "user"]),
  async function (req, res) {
    redis.get("allProducts", async function (err, allproducts) {
      //console.log(allproducts);
      if (err) console.log(err);
      const user = req.user;
      if (allproducts)
        return res
          .status(200)
          .send({ cached: JSON.parse(allproducts), user: user });

      const products = await Products.find().lean().exec();

      redis.set("allProducts", JSON.stringify(products));

      return res.send({ dbData: products, user: user });
    });
  }
);

router.get(
  "/:id",
  authenticate,
  authorize(["admin", "seller", "user"]),
  async function (req, res) {
    redis.get(`product.${req.params.id}`, async function (err, product) {
      //console.log(allproducts);
      if (err) console.log(err);
      const user = req.user;
      if (product)
        return res
          .status(200)
          .send({ cached: JSON.parse(product), user: user });

      const item = await Products.findById(req.params.id).lean().exec();

      redis.set(`product.${req.params.id}`, JSON.stringify(item));

      return res.send({ dbData: item, user: user });
    });
  }
);

router.patch(
  "/:id",
  authenticate,
  authorize(["admin", "seller"]),
  async function (req, res) {
    var products = await Products.updateOne({ _id: req.params.id }, req.body, {
      new: true,
    });
    const user = req.user;
    const item = await Products.findById(req.params.id).lean().exec();

    redis.set(`product.${req.params.id}`, JSON.stringify(item));
    var products = await Products.find().lean().exec();

    redis.set("allProducts", JSON.stringify(products));

    return res.send({ dbData: item, user: user });
  }
);
router.delete(
  "/:id",
  authenticate,
  authorize(["admin", "seller"]),
  async function (req, res) {
    const products = await Products.findByIdAndDelete({ _id: req.params.id });
    const user = req.user;

    redis.del(`product.${req.params.id}`);
    const allproducts = await Products.find().lean().exec();

    redis.set("allProducts", JSON.stringify(allproducts));

    return res.send({ products, user });
  }
);

module.exports = router;
