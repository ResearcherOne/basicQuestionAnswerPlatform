var redis = require("redis");
var client;

var errorCallback = null;
var monitorCallback = null;

module.exports = {
	initialize: function(options, callback){
		client = redis.createClient(options);

		client.on("error", function (err) {
			if(errorCallback !== null){
				errorCallback(err);
			} else {
				console.log("redisWrapper:Error callback is null. ");
			}
		});
		
		client.on("monitor", function (time, args, raw_reply) {
			if(monitorCallback !== null){
				monitorCallback(time, args, raw_reply); //console.log(time + ": " + args); // 1458910076.446514:['set', 'foo', 'bar'] 
			} else {
				console.log("redisWrapper:monitor callback is null.");
			}
		});

		client.on('ready', function() {
			callback();
		});
	},
	
	setErrorCallback: function(callback){
		errorCallback = callback;
	},
	
	getKeyValue: function(key, callback){
		client.get(key, function(err, result) {
			if (!err){
				if (result !== null) {
					callback(null, result);
				} else {
					callback(null, null);
				}
			} else {
				callback(err, null);
			}
			callback(err, result);
		});	
	},
	
	setKeyValue: function(key, value, callback){
		client.set(key, value, function(err, reply) {
			var isSucceed = false;
			if (!err){
				if (reply.toString() === "OK") {
					isSucceed = true;
					callback(null, isSucceed);
				} else {
					callback(null, isSucceed);
				}
			} else {
				callback(err, null);
			}
		});
	},
	
	addToSet: function(key, value, callback){
		client.sadd(key, value, function(err, reply){
			var isValueAlreadyExists = false;
			if(!err){
				if (reply == 0) {
					isValueAlreadyExists = true;
					callback(null, isValueAlreadyExists);
				} else {
					callback(null, isValueAlreadyExists);
				}
			} else {
				callback(err, null);
			}
		});
	},
	
	getSetMembers: function(key, callback){
		client.smembers(key, function(err, result){
			var isSucceed = false;
			if (!err){
				if(result !== undefined) {
					callback(null, result);
				} else {
					callback(null, null); //Not sure whether i should just pass undefined when result returns undefined or i should pass null.
				}
			} else {
				callback(err, null);
			}
		});
	},
	
	deleteKey: function(key, callback){ //0: silecek bir sey yok, 1: silindi
		client.del(key, function(err, reply) {
			var isDeleted = false;
			if(!err){
				if (reply == 1) {
					isDeleted = true;
					callback(null, isDeleted);
				} else {
					callback(null, isDeleted);
				}
			} else {
				callback(err, null);
			}
		});
	},
	
	setExpirationTime: function(key, expTimeInSeconds, callback){ //Ardi ardina expiration time koymak sürekli olarak bir onceki time'i resetliyor.
		client.expire(key, expTimeInSeconds, function(err, reply){
			var isExpirationTimeSet = false;
			if(!err){
				if (reply == 1) {
					isExpirationTimeSet = true;
					callback(null, isExpirationTimeSet);
				} else {
					callback(null, isExpirationTimeSet);
				}
			} else {
				callback(err, null);
			}
		});
	},
	
	isKeyExists: function(key, callback){
		client.exists(key, function(err, reply) {
			var isExists = false;
			if(!err){
				if (reply === 1) {
					isExists = true;
					callback(null, isExists);
				} else {
					callback(null, isExists);
				}			
			} else {
				callback(err, null);
			}
		});
	}
};
