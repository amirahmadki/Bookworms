const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const bcrypt = require("bcryptjs");

//load the model
require("../models/User");
const User = mongoose.model("users");

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You have successfully log out");
  res.redirect("/users/login");
});
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/ideas",
    failureFlash: true,
    failureRedirect: "/users/login"
  })(req, res, next);
});

router.post("/register", (req, res) => {
  let errors = [];

  if (req.body.password != req.body.password2) {
    errors.push({ text: "Passwords do not match" });
  }

  if (req.body.password.length < 4) {
    errors.push({ text: "Password must be atleast 4 characters long" });
  }

  if (errors.length > 0) {
    res.render("users/register", {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        req.flash("error_msg", "email already registered");
        res.redirect("/users/register");
      } else {
        const newUser = {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        };

        bcrypt.genSalt(10, (error, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw error;

            newUser.password = hash;
            new User(newUser)
              .save()
              .then(user => {
                req.flash("success_msg", "You are now register. Please login");
                res.redirect("/users/login");
              })
              .catch(error => {
                console.log(error);
                return;
              });
          });
        });
      }
    });
  }
});
module.exports = router;
