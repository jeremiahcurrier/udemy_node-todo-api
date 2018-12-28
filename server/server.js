// get everything ready to go

// load in mongoose
var mongoose = require('mongoose');

// callbacks are not as simple to chain/manage/scale as promises
// promises came from 'bluebird'
mongoose.Promise = global.Promise;

// connect to db
// mongoose maintains connection over time
mongoose.connect('mongodb://localhost:27017/TodoApp');

// save new something - no time (ms) for db to connect
// behind scenes mongoose waits for connection before making query
// no need to micromanage order things happen

// create a MODEL
// collections can store anything
// create a 'todo' model with attributes
// so mongo knows how to store our data
var Todo = mongoose.model('Todo', {
	// defines the props for this model
	// required/validators/type
	text: {
		type: String
	},
	completed: {
		type: Boolean
	},
	completedAt: {
		type: Number
	}
	// createdAt? No. Mongodb timestamp has that
});




// === ONE
// how to CREATE an INSTANCE of a 'Todo'?
// run as a constructor function bc creating new instance
// takes an arg including specified props
// var newTodo = new Todo({
// 	text: 'Cook dinner'
// });

// how to save to database??
/* ...creating new instance alone does not
update mongodb database. we need to call method on 
newTodo which is newTodo.save to save to mongodb
database.
returns a promise
tack on a .then() and include error handling (connection
failed, wrong type etc)
*/

// newTodo.save().then((doc) => {
// 	console.log('Saved todo', doc);
// }, (e) => {
// 	console.log('Unable to save todo');
// });
// Saved todo { __v: 0, text: 'Cook dinner', _id: 5c267898311f08e9c6e454aa }




// === TWO
// var newTodo2 = new Todo({
// 	text: 'Cook dinner 2',
// 	completed: false,
// 	// completedAt: 123 (2 minutes into year 1970)
// 	completedAt: 
// });

// newTodo2.save().then((doc) => {
// 	console.log('Saved todo', doc);
// }, (e) => {
// 	console.log('Unable to save todo');
// });




// === THREE
var newTodo3 = new Todo({
	text: 'Cook dinner 3',
	completed: true,
	// completedAt: 123 (2 minutes into year 1970)
	completedAt: 123
});

newTodo3.save().then((doc) => {
	// console.log('Saved todo', doc);
	console.log(JSON.stringify(doc, undefined, 2));
}, (e) => {
	console.log('Unable to save todo');
});