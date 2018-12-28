// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');
/* pulled out ObjectID constructor function
which lets us create new objectId on the fly. Even
if not using MongDB there is value is being able to
uniquely identify things*/

var obj = new ObjectID(); // create new instance of ObjectID
console.log(obj); // technique to incorporate objId anyway we like

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
	if (err) {
		return console.log('Unable to connect to MongoDB server');
	}
	console.log('Connected to MongoDB server');
	const db = client.db('TodoApp') // 'db' reference
	
	// db.collection('Todos').insertOne({ 
	// 	text: 'Something to do',
	// 	completed: false
	// }, (err, result) => {
	// 	if (err) {
	// 		return console.log('Unable to insert todo', err);
	// 	}
	// 	console.log(JSON.stringify(result.ops, undefined, 2));
	// });

	// db.collection('Users').insertOne({
	// 	// _id: 123,
	// 	name: 'Jeremiah',
	// 	age: 32,
	// 	location: 'San Francisco'
	// }, (err, result) => {
	// 	if (err) {
	// 		return console.log('Unable to insert user', err);
	// 	}
	// 	// console.log(JSON.stringify(result.ops, undefined, 2));
	// 	// console.log(result.ops[0]._id);
	// 	console.log(result.ops[0]._id.getTimestamp());
	// });

	client.close();
});