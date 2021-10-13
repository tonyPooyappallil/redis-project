require("dotenv").config();

const passport = require("passport");

var GoogleStrategy = require("passport-google-oauth2").Strategy;

const { v4: uuidV4 } = require("uuid");

const User = require("../models/user.model");

const { newToken } = require("../controllers/auth");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:2345/auth/google/callback",
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      // console.log(profile);
      const email = profile?._json?.email;
      console.log("email:", email);

      let user;
      try {
        user = await User.findOne({ email }).lean().exec();
        if (!user) {
          user = await User.create({ email: email, password: uuidV4() });
        }
        const token = newToken(user);
        return done(null, { user, token });
      } catch (error) {
        console.log("error", error);
      }
    }
  )
);

module.exports = passport;
