var mongoose = require('mongoose');

var User = mongoose.model('User', {
	email: {
		type: String,
		required: true,
		trim: true,
		minLength: 1
	}
});

// export the User model
module.exports = {User};
