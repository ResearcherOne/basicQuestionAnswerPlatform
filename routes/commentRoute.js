var express = require('express');
var router = express.Router();
var mongoModule = require('../models/mongoModule');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false}); /*{extended: false} option do "force the use of the native querystring Node library"*/

var hash = require('hash-string');

router.route('/')
	.post(parseUrlencoded, function (request, response){
		var postedEntry = request.body;
		var entryId = postedEntry.entryId;
		
		var comment = {
			fullName: postedEntry.fullName,
			comment: postedEntry.comment,
			thumbsup: 0,
			commentId: hash(postedEntry.fullName) + hash(postedEntry.comment),
			addedDate: new Date().getTime();
		};
		
		mongoModule.addComment(entryId, comment, function(err, isSuccess){
			var responseObject;
			if (isSuccess) {
				responseObject = {isSucceed: true, description: "Successfully added the comment."};
			} else {
				responseObject = {isSucceed: false, description: "Unable to add the comment."};
			}
			response.json(responseObject);
		});
  });

module.exports = router;