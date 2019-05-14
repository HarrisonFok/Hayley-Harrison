var Blog = require("../models/blog");
var Comment = require("../models/comment");
var Pic = require("../models/pic");
var middlewareObj = {}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

module.exports = middlewareObj;