var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

// configure middleware
app.use(bodyParser.json()); // can now send JSON to express application

app.post('/todos', (req, res) => {
	// get body data sent by the client (Slack Events API could be client)
	// console.log(req.body);
	var todo = new Todo({
		text: req.body.text
	});

	todo.save().then((doc) => { // save todo to db
		// s
		res.send(doc);
	}, (e) => {
		// e
		res.status(400).send(e);
		// https://httpstatuses.com/400
	});
});

app.listen(3000, () => {
	console.log('Started on port 3000');;
});
