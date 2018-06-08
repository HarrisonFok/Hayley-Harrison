var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// ===============================
// ROUTES
// ===============================

router.get("/", function(req, res){
	res.render("home");
});

router.get("/home_page", isLoggedIn, function(req, res){
	res.render("home_page");
});

// ===============================
// AUTH ROUTES
// ===============================

router.get("/register", function(req, res){
	res.render("register");
});

router.post("/register", function(req, res){
	// res.send("register post");
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		// Log user in
		passport.authenticate("local")(req, res, function(){
			res.redirect("/secret");
		});
	});
});

// ===============================
// LOGIN ROUTES
// ===============================

router.get("/login", function(req, res){
	res.render("login");
});

router.post("/login", passport.authenticate("local", {
	successRedirect: "/photos/blogs",
	failureRedirect: "/login"
}), function(req, res){
});

// ===============================
// LOGOUT ROUTE
// ===============================
router.get("/logout", function(req, res){
	// passport is destroying all user data from the session
	req.logout();
	res.redirect("/");
});	

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("login");
}

module.exports = router;