var express = require('express');
var router = express.Router();
var mongoModule = require('../models/mongoModule');

var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false}); /*{extended: false} option do "force the use of the native querystring Node library"*/

router.route('/question')
	.post(parseUrlencoded, function (request, response){
		var postedEntry = request.body;
		
		var entryId = postedEntry.entryId;
		
		mongoModule.upvoteQuestion(entryId, function(err, isSuccess){
			var responseObject;
			if (isSuccess) {
				responseObject = {isSucceed: true, description: "Successfully upvoted the question."};
			} else {
				responseObject = {isSucceed: false, description: "Unable to upvote the question."};
			}
			response.json(responseObject);
		});
	});

router.route('/comment')
	.post(parseUrlencoded, function (request, response){
		var postedEntry = request.body;
		
		var entryId = postedEntry.entryId;
		var commentId = postedEntry.commentId;
		
		mongoModule.upvoteComment(entryId, commentId, function(err, isSuccess){
			var responseObject;
			if (isSuccess) {
				responseObject = {isSucceed: true, description: "Successfully upvoted the question."};
			} else {
				responseObject = {isSucceed: false, description: "Unable to upvote the question."};
			}
			response.json(responseObject);
		});
	});

module.exports = router;