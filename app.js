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
var Comment = require("./models/comment");

// Require controllers
var blogController = require("./controllers/blog");
var picController = require("./controllers/picture");
var commentController = require("./controllers/comment");
var authController = require("./controllers/auth");

// Connect to the database of the website
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

// Require seeds file
var seedDB = require("./seeds");
// seedDB();

// Use the blog controller
app.use(blogController);
// Use the pic controller
app.use(picController);
// Use the comment controller
app.use(commentController);
// Use the auth controller
app.use(authController);

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

app.listen("3000", function(){
	console.log("Hayley-Harrison server running...");
});