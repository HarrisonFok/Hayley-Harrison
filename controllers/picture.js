var express = require("express");
var router = express.Router();
var Pic = require("../models/pic.js");
var middleware = require("../middleware");

// ===============================
// PICTURES ROUTES
// ===============================

// INDEX
router.get("/pictures", middleware.isLoggedIn, function(req, res) {
  // res.render("pictures/pictures");
  Pic.find({}, function(err, pics) {
    if (err) {
      console.log(err);
    } else {
      res.render("pictures/pictures", { pics: pics });
    }
  });
});

// NEW
router.get("/pictures/newPic", middleware.isLoggedIn, function(req, res) {
  res.render("pictures/newPic");
});

// CREATE
router.post("/pictures", middleware.isLoggedIn, function(req, res) {
  Pic.create(req.body.pic, function(err, newPic) {
    if (err) {
      res.render("new");
    } else {
      res.redirect("./pictures");
    }
  });
});

// SHOW
router.get("/pictures/:id", function(req, res) {
  // Find the picture with the right id and populate the comments array on it
  Pic.findById(req.params.id)
    .populate("comments")
    .exec(function(err, foundPic) {
      if (err) {
        res.redirect("/pictures");
      } else {
        // console.log(foundPic);
        res.render("showPic", { foundPic: foundPic });
      }
    });
});

// EDIT
router.get("/pictures/:id/edit", middleware.isLoggedIn, function(req, res) {
  Pic.findById(req.params.id, function(err, foundPic) {
    if (err) {
      res.send("Error");
    } else {
      res.render("editPic", { foundPic, foundPic });
    }
  });
});

// UPDATE
router.put("/pictures/:id", middleware.isLoggedIn, function(req, res) {
  Pic.findByIdAndUpdate(req.params.id, req.body.pic, function(err, updatedPic) {
    if (err) {
      res.send("Error");
    } else {
      res.redirect("/pictures");
    }
  });
});

// DELETE
router.delete("/pictures/:id", middleware.isLoggedIn, function(req, res) {
  Pic.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/pictures");
    } else {
      res.redirect("/pictures");
    }
  });
});

module.exports = router;
