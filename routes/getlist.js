var express = require('express');
var router = express.Router();
var mongoModule = require('../models/mongoModule');

router.route('/entries') //This was /
	.get(function (request, response){
		console.log("reuqest recevied")
		mongoModule.getEntryList(function(err, entryArray)
		{
			var resultJSON = {entryList: entryArray};
			response.send(JSON.stringify(resultJSON));
		console.log("sent!");
		});
	});
	

router.route('/comments/:entryId') //
	.get(function (request, response){
		var entryId = request.params.entryId;
		mongoModule.getCommentList(entryId, function(err, commentArray)
		{
			var resultJSON = {commentList: commentArray};
			response.send(JSON.stringify(resultJSON));
		});
	});
	
module.exports = router;