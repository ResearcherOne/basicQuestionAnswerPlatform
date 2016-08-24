var express = require('express');
var router = express.Router();
var mongoModule = require('../models/mongoModule');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false}); /*{extended: false} option do "force the use of the native querystring Node library"*/
var hash = require('hash-string');

router.route('/')
	.post(parseUrlencoded, function (request, response){
		var postedEntry = request.body;
		
		var newEntry = {
			question: postedEntry.question,
			thumbsup:0,
			entryId: hash(postedEntry.question),
			addedDate: new Date().getTime()
		};
		
		var newCommentObject = {
			entryId: newEntry.entryId,
			comments: []
		};
		
		mongoModule.isQuestionExist(newEntry.entryId, function(err, isExist){
			if(!err){
				if (!isExist){
					mongoModule.addQuestion(newEntry, newCommentObject, function(err, isSuccess){
						var responseObject;
						if (isSuccess) {
							responseObject = {isSucceed: true, description: "Successfully added the entry."};
						} else {
							responseObject = {isSucceed: false, description: "Unable to add the entry."};
						}
						response.json(responseObject);
					});
				} else {
					responseObject = {isSucceed: false, description: "This question already exists."};
					response.json(responseObject);
				}
			} else {
				responseObject = {isSucceed: false, description: "Unable to add the entry. Error occoured."};
				response.json(responseObject);
			}
		});
  });

module.exports = router;