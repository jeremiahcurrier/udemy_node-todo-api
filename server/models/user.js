const mongoose = require('mongoose');
const validator = require('validator');

// how could a database get compromised?

var User = mongoose.model('User', {
	email: {
		type: String,
		required: true,
		trim: true,
		minLength: 1,
		unique: true, // prevents another user in db from same email
		validate: {
			// validator: (value) => {
			// 	// call function
			// 	return validator.isEmail(value);
			// },
			validator: validator.isEmail,
			message: '{VALUE} is not a valid email'
		}
	},
	password: {
		type: String,
		require: true,
		minLength: 6
	},
// nested document available in mongo NOT in postgres - tokens is array - feature in mongo only
	tokens: [{
		access: {
			// code
			type: String,
			required: true
		},
		token: {
			// code
			type: String,
			require: true
		}
	}]

});

// export the User model
module.exports = {User};
