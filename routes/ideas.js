const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { ensureAuthenticated } = require("../helpers/auth");

//load the model
require("../models/Idea");
const Idea = mongoose.model("ideas");

router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("ideas/add");
});

router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  Idea.findOne({ _id: req.params.id }).then(idea => {
    if (idea.user != req.user.id) {
      req.flash(
        "error_msg",
        "You are not authorize to edit other users Books Information"
      );
      res.redirect("/ideas");
    } else {
      res.render("ideas/edit", { idea: idea });
    }
  });
});

router.get("/", ensureAuthenticated, (req, res) => {
  Idea.find({ user: req.user.id })
    .sort({ date: "desc" })
    .then(ideas => {
      var pagescount = 0;
      for (var idea of ideas) {
        pagescount = pagescount + idea.pages;
      }

      res.render("ideas/index", { ideas: ideas, pagescount: pagescount });
    });
});

router.post("/", ensureAuthenticated, (req, resp) => {
  let errors = [];

  if (!req.body.title) {
    errors.push({ text: "please enter the title" });
  }
  if (!req.body.details) {
    errors.push({ text: "Please enter some details" });
  }

  if (errors.length > 0) {
    resp.render("ideas/add", {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    //resp.send("Passed");

    const newUser = {
      title: req.body.title,
      details: req.body.details,
      pages: req.body.pages,
      user: req.user.id
    };

    new Idea(newUser).save().then(idea => {
      req.flash("success_msg", "New Book Added");
      resp.redirect("/ideas");
    });
  }
});

router.put("/:id", ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    if (idea.user != req.user.id) {
      req.flash(
        "error_msg",
        "You are not authorize to edit other people Books information"
      );
      res.redirect("/ideas");
    } else {
      idea.title = req.body.title;
      idea.details = req.body.details;
      idea.pages = req.body.pages;
      idea.save().then(idea => {
        req.flash("success_msg", "Book information updated");
        res.redirect("/ideas");
      });
    }
  });
});

router.delete("/:id", ensureAuthenticated, (req, res) => {
  Idea.deleteOne({ _id: req.params.id }).then(() => {
    req.flash("success_msg", "Book removed");
    res.redirect("/ideas");
  });
});

module.exports = router;
