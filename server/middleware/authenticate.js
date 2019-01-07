var {User} = require('./../models/user');

// MIDDLEWARE function to use on all routes to make PRIVATE
var authenticate = (req, res, next) => {
	var token = req.header('x-auth');

	User.findByToken(token).then((user) => {
		if (!user) {
			return Promise.reject(); // runs the error case in the catch below
		}

		// res.send(user); //send back user
		// modify request object to use inside a route
		req.user = user;
		req.token = token;
    next();
	}).catch((e) => {
		res.status(401).send();
	});
};

module.exports = {authenticate};
