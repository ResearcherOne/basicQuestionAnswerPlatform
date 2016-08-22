#Description:
	
#Front-End

#Back-End
	-Routes
		/useractions
			/vote (validateEntryId)
				/thumbsup
				/thumbsdown
			/ask
			/comment (validateEntryId)
			/getEntries
	-Required Modules
		Model:
			-mongoModule (uses mongoDbWrapper)
				addQuestion		(entry, callback)
				upvoteQuestion	(entryId, callback)
				downvoteQuestion(entryId, callback)
				addComment		(entryId, comment, callback)
				getEntryList	(callback)
				isQuestionExist	(entryId, callback)
		Middleware:
			stopFrequentUserActions
				vote,ask,comment each 30 seconds limited
	-data structure
		entry:{
			question:
			thumbsup:
			entryId:
		}
		
		commentGroup:{
			entryId: 
			//commentCount
			comments: [
				{
					commentId: hash(answer) + hash(fullName)
					fullName:
					comment:
					thumbsup:
				},
			]
		}