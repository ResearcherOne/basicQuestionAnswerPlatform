var express = require('express');
var router = express.Router();

var voteRoute = require('./voteRoute');
var askRoute = require('./askRoute');
var commentRoute = require('./commentRoute');
var getlist = require('./getlist');


/*
var appConfig = require('./appConfig');

var authModule = require('../models/authModule.js');
authModule.initializeModule(appConfig.redis);
function stopFrequentActions(request, response, next){
	if (typeof request.session.token !== 'undefined') {
		var userSessionSavedToken = request.session.token;
		if (authModule.isTokenExist(userSessionSavedToken)) {
			console.log("1")
			responseObject = {isSucceed: false, description: "Too frequent action."};
			response.json(responseObject);
			console.log("too frequent actions.");
			return;
		} else {
			console.log("2")
			var token = authModule.generateToken();
			authModule.saveToken(token, function(err, result){
				authModule.setTokenExpirationTime(token, 30);
				request.session.token = token;
				next();
			});
		}
	} else {
		console.log("3")
		console.log(JSON.stringify(request.session));
		var token = authModule.generateToken();
		authModule.saveToken(token, function(err, result){
			authModule.setTokenExpirationTime(token, 30);
			console.log("before:"+request.session.token);
			request.session.token = token;
			request.session.save(function(err) {
				console.log("after:"+request.session.token);
				next();
			})
		});
	}
}
*/

router.use('/vote', voteRoute);
router.use('/ask', askRoute);
router.use('/comment', commentRoute);
router.use('/getlist', getlist);

module.exports = router;
