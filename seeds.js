var mongoose = require("mongoose");
var Pic = require("./models/pic");
var Comment = require("./models/comment");

var data = [
	{
		title: "HI",
		image: "https://images.unsplash.com/photo-1518982703581-5fddaa030272?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=5aadc7e7b95aec22822d85abc4487203&auto=format&fit=crop&w=500&q=60",
		description: "HI"
	},
	{
		title: "HI",
		image: "https://images.unsplash.com/photo-1518982703581-5fddaa030272?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=5aadc7e7b95aec22822d85abc4487203&auto=format&fit=crop&w=500&q=60",
		description: "HI"
	},
	{
		title: "HI",
		image: "https://images.unsplash.com/photo-1518982703581-5fddaa030272?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=5aadc7e7b95aec22822d85abc4487203&auto=format&fit=crop&w=500&q=60",
		description: "HI"
	}
]

function seedDB(){
	// Remove all pictures
	Pic.remove({}, function(err){
		if(err){
			console.log(err);
		}
		console.log("Removed pictures");
		data.forEach(function(seed){
			// Add few pictures
			Pic.create(seed, function(err, pic){
				if(err){
					console.log(err);
				} else {
					console.log("Added picture");
					// Create a comment for each picture
					Comment.create(
						{
							text: "Hayley took this picture",
							author: "Hayley"
						}, function(err, comment){
							if(err){
								console.log(err);
							} else {
								pic.comments.push(comment);
								pic.save();
								console.log("Created new comment");
							}
						});
				}
			});
		});
	});
}

// It will send the function out, stored inside of seedDB in app.js, and execute it
module.exports = seedDB;