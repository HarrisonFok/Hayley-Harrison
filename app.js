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

var express = require("express");
app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

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

// ===============================
// BLOGS ROUTES
// ===============================

// INDEX
app.get("/photos/blogs", isLoggedIn, function(req, res){
	// Find all the blogs, then redirect to the blogs page along with all the blogs
	Blog.find({}, function(err, blogs){
		if(err){
			console.log(err);
		} else {
			res.render("blogsPage", {blogs: blogs});
		}
	});
});

// NEW
app.get("/photos/blogs/new", isLoggedIn, function(req, res){
	// Redirect to the page for creating new posts
	res.render("photos/new");
});

// CREATE
app.post("/photos/blogs", isLoggedIn, function(req, res){
	// Create a blog
	Blog.create(req.body.blog, function(err, newBlog){
		if(err) {
			res.render("new");
		} else {
			// redirect to index
			res.redirect("./blogs");
		}
	});
});

// SHOW - used when showing a specific blog
app.get("/photos/blogs/:id", isLoggedIn, function(req, res){
	// Find the blog and transfer to the show page if found. Otherwise, redirect to photos/blog
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/photos/blogs");
		} else {
			res.render("show", {foundBlog: foundBlog});
		}
	});
});

// EDIT
app.get("/photos/blogs/:id/edit", isLoggedIn, function(req, res){
	// Find the blog and transfer to the edit page if found. Otherwise, redirect to photos/blog
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/photos/blogs");
		} else {
			res.render("edit", {foundBlog: foundBlog});
		}
	});
});

// UPDATE
app.put("/photos/blogs/:id", isLoggedIn, function(req, res){
	// Blog.findByIdAndUpdate(id, newData, callBack)
	// req.body.blog contains all the info in the form

	// Find the blog and redirect to photos/blogs/particular_id if edited successfully. Otherwise,
	// redirect to photos/blogs
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/photos/blogs");
		} else {
			res.redirect("/photos/blogs/" + req.params.id);
		}
	});
});

// DELETE
app.delete("/photos/blogs/:id", isLoggedIn, function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/photos/blogs");
		} else {
			res.redirect("/photos/blogs");
		}
	});
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