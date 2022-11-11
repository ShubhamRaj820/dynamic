var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    id : String,
	
	username : String,
	stream : String,
	
	chat : [
		{
			sentby : String , message : String
		}
	]
});

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("Meeting", UserSchema);