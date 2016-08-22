var tokenGenerator = require('rand-token').uid;
var redisWrapper = require('./redisWrapper');

redisWrapper.initialize(function(){
	console.log("redis");
});
module.exports = {
	generateToken: function(){
		return tokenGenerator(16);
	},
	saveToken: function(token, callback){
		redisWrapper.setKeyValue(token, "dummy_value", function(err, result){
			callback(err, result);
		});
	},
	destroyToken: function(token, callback){
		redisWrapper.deleteKey(token, function(err, result){
			callback(err, result);
		});
	},
	isTokenExist: function(token, callback){
		redisWrapper.isKeyExists(token, function(err, isExists){
			callback(err, isExists);
		});
	},
	setTokenExpirationTime: function(token, expirationTimeInSeconds){
		redisWrapper.setExpirationTime(token, expirationTimeInSeconds, function(err, isSucceed){
			console.log("err"+err+" isSucceed"+isSucceed);
		});
	}
};