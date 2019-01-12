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
		res.header('x-auth', token).send(user);
	}).catch((e) => {
		res.status(400).send(e);
	});
});

app.get('/users/me', authenticate, (req, res) => {
	res.send(req.user);
});


	// // POST /users/login {email, password}
	// // pick off these from request body res.send(body) data
	// // make login call with email password and get that back
	// app.post('/users/login', (req, res) => {
	// 	// YOU HAVE TO ALREADY EXIST BY EMAIL
	// 	var body = _.pick(req.body, ['email', 'password']);
	// 	// res.send(body);
	// 	User.findByCredentials(body.email, body.password).then((user) => {
	// 		// res.send(user);
	// 		console.log('main');
	// 		// 'return' to keep the chain alive
	// 		return user.generateAuthToken().then((token) => {
	// 			res.header('x-auth', token).send(user);
	// 		});
	// 	}).catch((e) => {
	// 		console.log('catch');
	// 		// not able to login
	// 		res.status(400).send(e);
	// 	});
	// });

app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
		console.log('user');
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

// call to log out a user (requires auth) + remove token from tokens array
// it is a DELETE route since we're trying to remove something
// register it with a .delete()
// make route private (auth required to run code) and remember in our authentication middleware we're storing the token to grab out later
app.delete('/users/me/token', authenticate, (req, res) => {
	// delete the token that was used inside the 'authentication' middleware
	// to actually remove the token we will use a method - to define that method - an instance method - we have access to the user from the request so we'll call an instance method on the req.user
	// ideally it returns a promise so we can respond to the user when the token is deleted
	// define the removeToken() instance method inside of user.js
	req.user.removeToken(req.token).then(() => {
		// respond to user now that token is deleted
		// 1st callback to then()
		res.status(200).send();
	}, () => {
		// 2nd callback to then()
		// if things do not go well for some reason
		res.status(400).send();
	})
});

app.listen(port, () => {
	console.log(`Started on port ${port}`);
});

module.exports = {app};
