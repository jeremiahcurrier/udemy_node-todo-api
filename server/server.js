require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
// port set on Heroku for prod, locally for dev, and final env = test
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
	var todo = new Todo({
		text: req.body.text
	});

	todo.save().then((doc) => {
		res.send(doc);
	}, (e) => {
		res.status(400).send(e);
	});
});

app.get('/todos', (req, res) => {
	Todo.find().then((todos) => {
		res.send({todos});
	}, (e) => {
		res.status(400).send(e);
	});
});

app.get('/todos/:id', (req, res) => {
	var id = req.params.id;

	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	Todo.findById(id).then((todo) => {
	  if (!todo) {
			return res.status(404).send();
	  }

		// res.send(todo);
		// res.send({todo: todo});
		res.send({todo}); // es6 syntax
	}).catch((e) => {
		res.status(400).send();
	});
});

app.delete('/todos/:id', (req, res) => {
	// get the id
	var id = req.params.id;
	// validate the id -> not valid? return 404
	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}
	// remove todo by id
	Todo.findByIdAndRemove(id).then((todo) => {
	  // console.log(todo);
		// success
		if (!todo) {
			// if no doc, send 404
			return res.status(404).send();
		}
			// if doc, send doc back with 200
			// res.send(todo);
			// res.send({todo: todo});
			res.send({todo}); // es6 syntax
		// error
	}).catch((e) => {
		// 400 with empty body
		res.status(400).send();
	})
});

app.patch('/todos/:id', (req, res) => {
	var id = req.params.id;
	var body = _.pick(req.body, ['text', 'completed']); // has subset of things user passed to us and we only want to PICK some things for the user to be able to update.

	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	// checking completed value and setting completedAt (timestamp or cleared)
	if(_.isBoolean(body.completed) && body.completed) {
		body.completedAt = new Date().getTime(); // num ms on midnight of jan 1st since 1970 epoch-epic
	} else {
		// not boolean and or not true
		body.completed = false;
		body.completedAt = null; // remove form db = null
	}

	// query to update db
	Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => { // use mongoDb operators (like incrementors or $set)
		if (!todo) {
			return res.status(404).send();
		}

		// res.send({todo: todo});
		res.send({todo}); // es6 syntax
		// success
	}).catch((e) => {
		res.status(400).send();
	});
});

// POST to /users same for creating new todos
app.post('/users', (req, res) => {
	var body = _.pick(req.body, ['email', 'password']);
	var user = new User(body);

	user.save().then(() => {
		return user.generateAuthToken(); // return since we're expecting a chaining promise
	}).then((token) => {
		// add token as http header and send token back
		res.header('x-auth', token).send(user); // x- = custom header
	}).catch((e) => {
		res.status(400).send(e);
	});
});

// // MIDDLEWARE function to use on all routes to make PRIVATE
// var authenticate = (req, res, next) => {
// 	var token = req.header('x-auth');
//
// 	User.findByToken(token).then((user) => {
// 		if (!user) {
// 			return Promise.reject(); // runs the error case in the catch below
// 		}
//
// 		// res.send(user); //send back user
// 		// modify request object to use inside a route
// 		req.user = user;
// 		req.token = token;
// 		next();
// 	}).catch((e) => {
// 		res.status(401).send();
// 	});
// };

// baby's first private route!
app.get('/users/me', authenticate, (req, res) => {
	res.send(req.user);
});

app.listen(port, () => {
	console.log(`Started on port ${port}`);
});

module.exports = {app};
