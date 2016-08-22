var express = require('express');
var app = express();

var allowCrossOrigin = require('./models/allowCrossOriginMiddleware');
var questionAnswerPlatform = require('./routes/questionAnswerPlatform');

var mongoModule = require('./models/mongoModule');
var appConfig = require('./appConfig');

mongoModule.initializeModule(appConfig.mongoModule.url, appConfig.mongoModule.questionCollectionName, appConfig.mongoModule.commentCollectionName,function(err, isSucceed){
	if(isSucceed) {
		console.log("Successfully initialized mongodb.");
		
		app.use(express.static('public'));
		app.use('/questionAnswerPlatform', allowCrossOrigin, questionAnswerPlatform);

		app.listen(appConfig.applicationPort, function(){
		  console.log('Listening on port '+appConfig.applicationPort+' \n');
		});
	} else {
		console.log("Unable to initialize mongodb.");
		process.exit();
	}
});

