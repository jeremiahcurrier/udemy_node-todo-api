const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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

// define a model methods
// .statics = object; everything added to it becomes MODEL method (vs INSTANCE method)
UserSchema.statics.findByToken = function (token) {
	var User = this; // the Model is the 'this' binding
	var decoded; // stores decoded JWT values - return from jwt.verify in hashing.js
	// we wanna try something and catch the error if present
	try {
		// if error stop executing > move to catch block > continue in program
		decoded = jwt.verify(token, 'secretvalue');
	} catch (e) {
		// return new Promise((resolve, reject) => {
		// 	reject();
		// });
		return Promise.reject();
	}

	// success case - decode token passed in as header
	// return to add to chaining
	return User.findOne({
		// query our nested object properties
		'_id': decoded._id, // quotes not required unless a . in the key
		// find user whose 'tokens' array has object where token prop = token prop passed in
		'tokens.token': token,
		'tokens.access': 'auth'
	});
};

UserSchema.pre('save', function(next) { // save is Mongoose document save event
	// do something
	var user = this;
	// now we can check if password was modified
	if (user.isModified('password')) {
		// hash the password using bcrypt if not modified
		bcrypt.genSalt(10, (err, salt) => {
			// user.password
		  bcrypt.hash(user.password, salt, (err, hash) => {
				// user.password = hash;
				user.password = hash;
				// next() to complete middleware and save document
				next();
		  });
		});

	} else {
		next();
	}
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};
