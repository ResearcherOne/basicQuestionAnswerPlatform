var mongoWrapper = require('./mongoWrapper.js');
var entryCollectionName;
var commentCollectionName;

module.exports = {
	initializeModule: function(url, entryCollectionNameInput, commentCollectionNameInput, callback)
	{
		mongoWrapper.initializeClient(url, function(err, isSucceed){
			if (isSucceed){
				entryCollectionName = entryCollectionNameInput;
				commentCollectionName = commentCollectionNameInput;
				callback(null, true);
			} else {
				callback(err, false);
			}
		});
	},
	addQuestion: function(entry, commentObject, callback){
		mongoWrapper.insertObject(entryCollectionName, entry, function(err, result){
			if(!err){
				mongoWrapper.insertObject(commentCollectionName, commentObject, function(err, result){
					if(!err){
						callback(null, result);
					} else {
						callback(err, null);
					}
				})
			} else {
				callback(err, null);
			}
		})
	},
	upvoteQuestion: function(entryId, callback){
		var updateCriteria = {"entryId": parseInt(entryId)};
		var updateData = {$inc:{"thumbsup":1}};

		mongoWrapper.updateObject(entryCollectionName, updateCriteria, updateData, function(err, result){
			console.log("err:"+JSON.stringify(err));
			console.log("result:"+JSON.stringify(result));
			if(!err){
				console.log("result:"+result);
				callback(null, true);
			} else {
				callback(err, false)
			}
		});
	},
	addComment: function(entryId, comment, callback){
		//Entry id yoksa COMM,res{"value":null,"ok":1}
		//varsa: res{"value":{"_id":"57ba052596b09e7c5ef10732","whoAsked":"birkan kolcu","question":"Is it working?","thumbsup":5,"thumbsdown":2,"comments":[],"entryId":3499264668},"lastErrorObject":{"updatedExisting":true,"n":1},"ok":1}
		var updateCriteria = {"entryId": parseInt(entryId)};
		var updateData =  {$push: {'comments': comment}};
		mongoWrapper.updateObject(commentCollectionName, updateCriteria, updateData, function(err, result){
			if(!err){
				callback(null, true);
			} else {
				callback(err, false)
			}
		});
	},
	upvoteComment: function(entryId, commentId, callback){
		var updateCriteria = {"entryId": parseInt(entryId), "comments.commentId": parseInt(commentId)};
		var updateData = {$inc:{"comments.$.thumbsup":1}};
		
		mongoWrapper.updateObject(commentCollectionName, updateCriteria, updateData, function(err, result){
			if(!err){
				console.log("result:"+JSON.stringify(result));
				callback(null, true);
			} else {
				callback(err, false)
			}
		});
	},
	getCommentList: function(entryId, callback){
		var findCriteria = {"entryId": parseInt(entryId)};
		var sortCriteria = {"comments.thumbsup": -1};
		mongoWrapper.findObjectsAndSortByCriteriaAsArray(commentCollectionName, findCriteria, sortCriteria, function(err, result){
			if(!err){
				if (result.length>0)
					callback(null, result[0].comments);
				else
					callback(null, null);
			} else {
				callback(err, null)
			}
		});
	},
	getEntryList: function(callback){
		var sortCriteria = {"thumbsup": -1};
		mongoWrapper.getCollectionAsArrayAndSortByCriteria(entryCollectionName, sortCriteria, function(err, result){
			if(!err){
				callback(null, result);
			} else {
				callback(err, null)
			}
		});
	},
	isQuestionExist: function(entryId, callback){
		var queryCriteria = {"entryId": parseInt(entryId)};
		mongoWrapper.isDocumentExist(entryCollectionName, queryCriteria, function(err,isExist){
			if(!err) {
				callback(null, isExist);
			} else {
				callback(err, null);
			}
		});
	}
}