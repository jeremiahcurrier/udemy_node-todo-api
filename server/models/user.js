const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		trim: true,
		minLength: 1,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: '{VALUE} is not a valid email'
		}
	},
	password: {
		type: String,
		require: true,
		minLength: 6
	},
	tokens: [{
		access: {
			type: String,
			required: true
		},
		token: {
			type: String,
			require: true
		}
	}]
});

UserSchema.methods.toJSON = function() {
	var user = this;
	var userObject = user.toObject();

	return _.pick(userObject, ['_id', 'email']);
};

// arrow functions do not bind a 'this' keyword which we need in this case, why? because 'this' stores the individual document
UserSchema.methods.generateAuthToken = function () {
	var user = this;
	var access = 'auth';
	var token = jwt.sign({_id: user._id.toHexString(), access}, 'secretvalue').toString();

	// user.tokens.push({access, token});
	user.tokens = user.tokens.concat([{access, token}]); // works in wider range of mongodb versions

	// // need to save
	// user.save().then(() => {
	// 	// success
	// 	return token;
	// }).then((token) => {
	// 	// this happens in server.js
	// })

	// in order to allow server.js to chain onto the promise we'll return interval
	return user.save().then(() => {
		return token;
	});
};

var User = mongoose.model('User', UserSchema);

module.exports = {User};
