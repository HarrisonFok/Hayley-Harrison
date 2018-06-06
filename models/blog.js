var express = require("express");
app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
// mongoose.connect("mongodb://localhost/HayleyAndHarrisonBlogApp");

// Model config
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});

// Compile the schema into the model
module.exports = mongoose.model("Blog", blogSchema);