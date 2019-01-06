var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

// expect = assertions
// mocha = entire test suite
// supertest = to test express routes
// nodemon = lets us create test-watch script we had so we can automatically restart the test suite - nodemon is installed globally but since using inside a package.json script = good idea to install locally as well
// 1 - verify if send correct data as body we get back 200 w completed doc including the id
// 2 - if we send bad data expect 400 with error obj
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

app.listen(3000, () => {
	console.log('Started on port 3000');;
});

module.exports = {app};
