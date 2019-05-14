var express = require("express");
var router = express.Router();
var Blog = require("../models/blog.js");
var middleware = require("../middleware");

// ===============================
// BLOGS ROUTES
// ===============================

// INDEX
router.get("/photos/blogs", middleware.isLoggedIn, function(req, res){
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
router.get("/photos/blogs/new", middleware.isLoggedIn, function(req, res){
	// Redirect to the page for creating new posts
	res.render("photos/new");
});

// CREATE
router.post("/photos/blogs", middleware.isLoggedIn, function(req, res){
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
router.get("/photos/blogs/:id", middleware.isLoggedIn, function(req, res){
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
router.get("/photos/blogs/:id/edit", middleware.isLoggedIn, function(req, res){
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
router.put("/photos/blogs/:id", middleware.isLoggedIn, function(req, res){
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
router.delete("/photos/blogs/:id", middleware.isLoggedIn, function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/photos/blogs");
		} else {
			res.redirect("/photos/blogs");
		}
	});
});

module.exports = router;