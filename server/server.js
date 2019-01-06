var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
// load in the objectId from the mongoDB native driver
var {ObjectID} = require('mongodb');

var app = express();

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
		res.send({todos}); // create an object so you can add properties later on VS sending an Array back. More flexible future
	}, (e) => {
		// e
		res.status(400).send(e);
	});
});

// GET /todos/123123
app.get('/todos/:id', (req, res) => {
	var id = req.params.id;

	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}
	// validate id using isValid
		// if not stop respond 404 - send empty body .send();

		Todo.findById(id).then((todo) => {
		  if (!todo) {
		    // return console.log('Id not found');
				// return res.status(404).send();
				return res.status(404).send();
		  }

		  // console.log('Todo By Id', todo);
			res.send({todo});
		}).catch((e) => {
			res.status(400).send();
		});
	// query db using findById query todos collections
		// s
			// if todo - send it back
			// if no todo - call good - no id in collection send 404 with empty body
		// e
			// 400 - could contain private information and send empty body back

	// res.send(req.params);
});

app.listen(3000, () => {
	console.log('Started on port 3000');;
});

module.exports = {app};
