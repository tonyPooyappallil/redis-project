const express = require("express");
require("dotenv").config();

const passport = require("./configs/passport");

const userController = require("./controllers/users.controller");
const productsController = require("./controllers/products.controller");

const app = express();
app.use(express.json());
app.use(passport.initialize());

passport.serializeUser(function ({ user, token }, done) {
  done(null, { user, token });
});
passport.deserializeUser(function ({ user, token }, done) {
  done(err, { user, token });
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/google/failure",
  }),
  function (req, res) {
    return res.status(200).send({ user: req.user.user, token: req.user.token });
  }
);

app.use("/users", userController);
app.use("/products", productsController);

module.exports = app;
