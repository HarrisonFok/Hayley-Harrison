// npm install express mongoose --save
// npm install passport passport-local --save
// npm install passport-local-mongoose --save
// npm install body-parser express-session --save
// npm install ejs --save

// EDIT:
// npm install method-override --save

/*
RESTful routes - example by Colt Steele

name      url                  verb        description
===================================================================================
INDEX    /dogs                  GET         Display all dogs
NEW      /dogs/new              GET         Displays form to make new dogs
CREATE   /dogs/new              POST        Add new dog to database
SHOW     /dogs/:id              GET         Shows info about one dog
EDIT	 /dogs/:id/edit 		GET 		Show edit form for one dog
UPDATE 	 /dogs/:id 				PUT			Update a particular dog, then redirect
DESTROY  /dogs/:id 				DELETE		Delete a particular dog, then redirect
*/

/*
The stuff that makes a chunk of things look nice is from Views -> Item on
https://semantic-ui.com/elements/segment.html
*/

var express = require("express");
var app = express();
var mongoose = require("mongoose");
var passport = require("passport");
var bodyParser = require("body-parser");
var localStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var expressSession = require("express-session");
var methodOverride = require("method-override");

// Require Models
var Blog = require("./models/blog");
var User = require("./models/user");
var Pic = require("./models/pic");

// Require controllers
// var authController = require("./controllers/auth");
var blogController = require("./controllers/blog");

mongoose.connect("mongodb://localhost/hayley_harrison_website");

app.use(require("express-session")({
	// will be used to encode/decode the sessions
	secret: "Hayley and Harrison loves each other",
	resave: false,
	saveUninitialized: false
}));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
// what it should look for in the URL to override a method
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("public"));

// Create new local strategy, using the User.authenticate method coming from passportLocalMongoose (on user.js)
passport.use(new localStrategy(User.authenticate()));
// Read session, take data from it, and encode/decode it
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.use(authController);

// ===============================
// ROUTES
// ===============================

app.get("/", function(req, res){
	res.render("home");
});

app.get("/home_page", isLoggedIn, function(req, res){
	res.render("home_page");
});

// ===============================
// AUTH ROUTES
// ===============================

app.get("/register", function(req, res){
	res.render("register");
});

app.post("/register", function(req, res){
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

app.get("/login", function(req, res){
	res.render("login");
});

app.post("/login", passport.authenticate("local", {
	successRedirect: "/photos/blogs",
	failureRedirect: "/login"
}), function(req, res){
});

// ===============================
// LOGOUT ROUTE
// ===============================
app.get("/logout", function(req, res){
	// passport is destroying all user data from the session
	req.logout();
	res.redirect("/");
});	

// ===============================
// PICTURES ROUTES
// ===============================

// INDEX
app.get("/pictures", isLoggedIn, function(req, res){
	// res.render("pictures/pictures");
	Pic.find({}, function(err, pics){
		if(err){
			console.log(err);
		} else {
			res.render("pictures/pictures", {pics: pics});
		}
	});
});

// NEW 
app.get("/pictures/newPic", isLoggedIn, function(req, res){
	res.render("pictures/newPic");
});	

// CREATE
app.post("/pictures", isLoggedIn, function(req, res){
	Pic.create(req.body.pic, function(err, newPic){
		if(err){
			res.render("new");
		} else {
			res.redirect("./pictures");
		}
	});	
});

// SHOW
app.get("/pictures/:id", isLoggedIn, function(req, res){
	Pic.findById(req.params.id, function(err, foundPic){
		if(err){
			res.redirect("/pictures");
		} else {
			res.render("showPic", {foundPic: foundPic});
		}
	});
});

// EDIT
app.get("/pictures/:id/edit", isLoggedIn, function(req, res){
	Pic.findById(req.params.id, function(err, foundPic){
		if(err){
			res.send("Error");
		} else {
			res.render("editPic", {foundPic, foundPic});
		}
	});
});

// UPDATE
app.put("/pictures/:id", isLoggedIn, function(req, res){
	Pic.findByIdAndUpdate(req.params.id, req.body.pic, function(err, updatedPic){
		if(err){
			res.send("Error");
		} else {
			res.redirect("/pictures");
		}
	});
});

// DELETE
app.delete("/pictures/:id", isLoggedIn, function(req, res){
	Pic.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/pictures");
		} else {
			res.redirect("/pictures");
		}
	})
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

// Use the blog controller
app.use(blogController);

app.listen("3000", function(){
	console.log("Hayley-Harrison server running...");
});