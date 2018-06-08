var express = require("express");
app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

// Picture model config
var picSchema = new mongoose.Schema({
	title: String,
	image: String,
	description: String,
	created: {type: Date, default: Date.now},
	// the comments array should consist of comment ids
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});
// Compile the pic schema into a model called "Pic"
module.exports = mongoose.model("Pic", picSchema);