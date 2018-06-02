// npm install express mongoose --save
// npm install passport passport-local --save
// npm install passport-local-mongoose --save
// npm install body-parser express-session --save
// npm install ejs --save

/*
RESTful routes

name      url                  verb        description
===================================================================================
INDEX    /dogs                  GET         Display all campgrounds
NEW      /dogs/new              GET         Displays form to make new dogs
CREATE   /dogs/new              POST        Add new dog to database
SHOW     /dogs/:id              GET         Shows info about one dog
EDIT	 /dogs/:id/edit 		GET 		Show edit form for one dog
UPDATE 	 /dogs/:id 				PUT			Update a particular dog, then redirect
DESTROY  /dogs/:id 				DELETE		Delete a particular dog, then redirect
*/

var express = require("express");
var app = express();
var mongoose = require("mongoose");
var passport = require("passport");
var bodyParser = require("body-parser");
var localStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var expressSession = require("express-session");
var User = require("./models/user");

mongoose.connect("mongodb://localhost/hayley_harrison_website");

app.use(require("express-session")({
	// will be used to encode/decode the sessions
	secret: "Hayley and Harrison loves each other",
	resave: false,
	saveUninitialized: false
}));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());

// Create new local strategy, using the User.authenticate method coming from passportLocalMongoose (on user.js)
passport.use(new localStrategy(User.authenticate()));
// Read session, take data from it, and encode/decode it
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});

// Compile the schema into the model
var Blog = mongoose.model("Blog", blogSchema);

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
	successRedirect: "/home_page",
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

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

app.listen("3000", function(){
	console.log("Hayley-Harrison server running...");
});