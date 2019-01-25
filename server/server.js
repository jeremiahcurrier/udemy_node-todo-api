require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const hbs = require('hbs');
const fs = require('fs');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
	/* port set on Heroku for prod, locally for dev, and final env = test */
const port = process.env.PORT || 3000;

app.use(bodyParser.json());


	///////////////////////////////////////////
	//////// web server - static files ////////
	///////////////////////////////////////////
		/* If your project is within a subfolder and NOT in a root folder, you must add app.set('views', __dirname + '/views'); So the deploy tool known as heroku will not fail while deploying views in subfolders. */

		/* tell express what is our view engine: handlebars */
	app.set('view engine', 'hbs');
		/* register views folder: important when your project is within a subfolder */
	app.set('views', __dirname + '/views');
		/* support to partial views */
	hbs.registerPartials(__dirname + '/views/partials');

		/* writes to a log file */
	// app.use((req, res, next) => {
	// 	var now = new Date().toString();
	// 	var log = `${now}: ${req.method} ${req.url}`;
	// 	console.log(log);
	// 	// // old fs
	// 	// fs.appendFile('server.log', log + '\n');
	// 	// new fs
	// 	fs.appendFile('server.log', log + '\n', (err) => {
	// 		if (err) {
	// 			console.log('Unable to append to server.log')
	// 		}
	// 	});
	// 	next();
	// });

		/* check if we're in maintenance mode */
	// app.use((req, res, next) => {
	// 	res.render('maintenance.hbs');
	// 	// next();
	// 	/* you can just leave next() commented
	// 	while you are doing maintenance */
	// });

	hbs.registerHelper('getCurrentYear', () => {
		return new Date().getFullYear();
	});

	hbs.registerHelper('screamIt', (text) => {
		return text.toUpperCase();
	});

	app.get('/', (req, res) => {
		res.render('home.hbs', {
			pageTitle: 'Home page',
			welcomeMessage: 'Todo list API.'
		});
	});

	app.get('/about', (req, res) => {
		res.render('about.hbs', {
			pageTitle: 'About page'
		});
	});

	app.get('/projects', (req, res) => {
		// res.render('projects.hbs', {
		// 	pageTitle: 'Projects'
		// });
		res.render('error.hbs');
	});

	app.get('/lindsey', function(req, res) {
	  res.render('lindsey.hbs');
	});

	/////////////////////////////////////////
	//  Handling non-existing routes   //////
	/////////////////////////////////////////
		/* comment this out during `npm test` */
	// app.get('*', function(req, res) {
	//   res.render('error.hbs');
	// });


////////////////////////////////////////////////////
///////////////  All other routes   ////////////////
////////////////////////////////////////////////////

////////////////////////
// callbacks/promises //
////////////////////////
	/* w the 'authenticate' middleware added to the route */
// app.post('/todos', authenticate, (req, res) => {
// // app.post('/todos', (req, res) => {
// 	var todo = new Todo({
// 		text: req.body.text,
// 		_creator: req.user._id // id of the user
// 	});
//
// 	todo.save().then((doc) => {
// 		res.send(doc);
// 	}, (e) => {
// 		res.status(400).send(e);
// 	});
// });
////////////////////////
////  async/await  /////
////////////////////////
app.post('/todos', authenticate, async (req, res) => {
	const todo = new Todo({
		text: req.body.text,
		_creator: req.user._id
	});
	try {
		const doc = await todo.save();
		res.send(doc);
	} catch (e) {
		res.status(400).send(e);
	}
});

////////////////////////
// callbacks/promises //
////////////////////////
	/*  w/the 'authenticate' middleware (requiring an 'x-auth' header to fetch todos) */
	/* app.get('/todos', (req, res) => { */
// app.get('/todos', authenticate, (req, res) => {
// 	Todo.find({
// 		_creator: req.user._id
// 	}).then((todos) => {
// 		res.send({todos});
// 	}, (e) => {
// 		res.status(400).send(e);
// 	});
// 	// Todo.find({
// 	// 	// only todos that this user created
// 	// 	_creator: req.user._id
// 	// }).then((todos) => {
// 	// 	res.send({todos});
// 	// }, (e) => {
// 	// 	res.status(400).send(e);
// 	// });
// });
////////////////////////
////  async/await  /////
////////////////////////
app.get('/todos', authenticate, (req, res) => {
	Todo.find({
		_creator: req.user._id
	}).then((todos) => {
		res.send({todos});
	}, (e) => {
		res.status(400).send(e);
	});
});

////////////////////////
// callbacks/promises //
////////////////////////
// app.get('/todos/:id', authenticate, (req, res) => {
// 	var id = req.params.id;
//
// 	if (!ObjectID.isValid(id)) {
// 		return res.status(404).send();
// 	}
//
// 	// Todo.findById(id).then((todo) => {
// 	Todo.findOne({
// 		_id: id,
// 		_creator: req.user._id
// 	}).then((todo) => {
// 	  if (!todo) {
// 			return res.status(404).send();
// 	  }
//
// 		// res.send(todo);
// 		// res.send({todo: todo});
// 		res.send({todo}); // es6 syntax
// 	}).catch((e) => {
// 		res.status(400).send();
// 	});
// });
////////////////////////
////  async/await  /////
////////////////////////
app.get('/todos/:id', authenticate, async (req, res) => {
	const id = req.params.id;
	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}
	try {
		const todo = await Todo.findOne({
			_id: id,
			_creator: req.user._id
		});
		if (!todo) {
			return res.status(404).send();
	  }
		res.send({todo});
	} catch (e) {
		res.status(400).send();
	}
});

////////////////////////
// callbacks/promises //
////////////////////////
// app.delete('/todos/:id', authenticate, (req, res) => {
// 	var id = req.params.id;
// 	if (!ObjectID.isValid(id)) {
// 		return res.status(404).send();
// 	}
// 	Todo.findOneAndRemove({
// 		_id: id,
// 		_creator: req.user._id
// 	}).then((todo) => {
// 		if (!todo) {
// 			return res.status(404).send();
// 		}
// 		res.send({todo});
// 	}).catch((e) => {
// 		res.status(400).send();
// 	})
// });
////////////////////////
////  async/await  /////
////////////////////////
app.delete('/todos/:id', authenticate, async (req, res) => {
	const id = req.params.id;
	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}
	try {
		const todo = await Todo.findOneAndRemove({
			_id: id,
			_creator: req.user._id
		});
		if (!todo) {
			return res.status(404).send();
		}

		res.send({todo});
	} catch (e) {
		res.status(400).send();
	}
});

////////////////////////
// callbacks/promises //
////////////////////////
// app.patch('/todos/:id', authenticate, (req, res) => {
// 	var id = req.params.id;
// 	var body = _.pick(req.body, ['text', 'completed']);
// 	/* has subset of things user passed to us and we only want to PICK some things for the user to be able to update. */
// 	if (!ObjectID.isValid(id)) {
// 		return res.status(404).send();
// 	}
// 	// checking completed value and setting completedAt (timestamp or cleared)
// 	if(_.isBoolean(body.completed) && body.completed) {
// 		body.completedAt = new Date().getTime(); // num ms on midnight of jan 1st since 1970 epoch-epic
// 	} else {
// 		// not boolean and or not true
// 		body.completed = false;
// 		body.completedAt = null; // remove form db = null
// 	}
// 		// query to update db
// 		// findOneAndUpdate
// 	Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then((todo) => {
// 		if (!todo) {
// 			return res.status(404).send();
// 		}
//
// 		res.send({todo});
// 	}).catch((e) => {
// 		res.status(400).send();
// 	})
// });
////////////////////////
////  async/await  /////
////////////////////////
app.patch('/todos/:id', authenticate, async (req, res) => {
	const id = req.params.id;
	const body = _.pick(req.body, ['text', 'completed']);
	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}
	if(_.isBoolean(body.completed) && body.completed) {
		body.completedAt = new Date().getTime();
	} else {
		body.completed = false;
		body.completedAt = null;
	}

	try {
		const todo = await Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true});
		if (!todo) {
			return res.status(404).send();
		}
		res.send({todo});
	} catch (e) {
		res.status(400).send();
	}
});

////////////////////////
// callbacks/promises //
////////////////////////
	/* POST to /users same for creating new todos */
app.post('/users', (req, res) => {
	var body = _.pick(req.body, ['email', 'password']);
	var user = new User(body);
	user.save().then(() => {
		return user.generateAuthToken();
	}).then((token) => {
		res.header('x-auth', token).send(user);
	}).catch((e) => {
		res.status(400).send(e);
	});
});
////////////////////////
////  async/await  /////
////////////////////////
	/* POST to /users same for creating new todos */
app.post('/users', async (req, res) => {
	try {
		const body = _.pick(req.body, ['email', 'password']);
		const user = new User(body);
		await user.save();
		const token = await user.generateAuthToken();
		res.header('x-auth', token).send(user);
	} catch (e) {
		res.status(400).send(e);
	}
});

app.get('/users/me', authenticate, (req, res) => {
	res.send(req.user);
});

////////////////////////
// callbacks/promises //
////////////////////////
// app.post('/users/login', (req, res) => {
//   var body = _.pick(req.body, ['email', 'password']);
//   User.findByCredentials(body.email, body.password).then((user) => {
//     return user.generateAuthToken().then((token) => {
//       res.header('x-auth', token).send(user);
//     });
//   }).catch((e) => {
//     res.status(400).send();
//   });
// });
////////////////////////
////  async/await  /////
////////////////////////
app.post('/users/login', async (req, res) => {
	try {
		const body = _.pick(req.body, ['email', 'password']);
		const user = await User.findByCredentials(body.email, body.password);
		const token = await user.generateAuthToken();
		res.header('x-auth', token).send(user);
	} catch (e) {
		res.status(400).send();
	}
});

////////////////////////
// callbacks/promises //
////////////////////////
	/* call to log out a user (requires auth) + remove token from tokens array. It is a DELETE route since we're trying to remove something. Register it with a .delete() ; Make route private (auth required to run code) and remember in our authentication middleware we're storing the token to grab out later */
// app.delete('/users/me/token', authenticate, (req, res) => {
// 	req.user.removeToken(req.token).then(() => {
// 		// respond to user now that token is deleted
// 		// 1st callback to then()
// 		res.status(200).send();
// 	}, () => {
// 		// 2nd callback to then()
// 		// if things do not go well for some reason
// 		res.status(400).send();
// 	})
// });
////////////////////////
////  async/await  /////
////////////////////////
app.delete('/users/me/token', authenticate, async (req, res) => {
	try {
		await req.user.removeToken(req.token);
		res.status(200).send();
	} catch (e) {
		res.status(400).send();
	}
});

app.listen(port, () => {
	console.log(`Started on port ${port}`);
});

module.exports = {app};
