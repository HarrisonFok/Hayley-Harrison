var express = require("express");
var router = express.Router();
var Comment = require("../models/comment");
var Pic = require("../models/pic");

// ===============================
// COMMENTS ROUTES
// ===============================
router.get("/pictures/:id/comments/new", isLoggedIn, function(req, res){
	Pic.findById(req.params.id, function(err, foundPic){
		if(err){
			console.log(err);
		} else {
			res.render("comments/newComment", {foundPic: foundPic});
		}
	});
});

router.post("/pictures/:id/comments", isLoggedIn, function(req, res){
	// Look up picture using id
	Pic.findById(req.params.id, function(err, foundPic){
		if(err){
			console.log(err);
			res.redirect("/pictures");
		} else {
			// Create new comment
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				} else {
					// Connect new comment to picture
					foundPic.comments.push(comment);
					foundPic.save();
					// Redirect to pictures show page
					res.redirect("/pictures/" + foundPic._id);
				}
			});
		}
	});
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

module.exports = router;