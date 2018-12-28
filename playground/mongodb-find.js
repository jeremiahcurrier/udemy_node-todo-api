// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
	if (err) {
		return console.log('Unable to connect to MongoDB server');
	}
	console.log('Connected to MongoDB server');
	const db = client.db('TodoApp') // 'db' reference
	
	// db.collection('Todos').find() // returns CURSOR
	// db.collection('Todos').find().toArray() // returns promise
	
	// // fetch docs, convert to array, and print to screen
	// db.collection('Todos').find().toArray().then((docs) => {
	// 	console.log('Todos');
	// 	console.log(JSON.stringify(docs, undefined, 2));
	// }, (err) => {
	// 	console.log('Unable to fetch todos', err);
	// });
	
	// // how to query based on certain values?
	// // specify how to query 'todos' collection
	// db.collection('Todos').find({completed: true}).toArray().then((docs) => {
	// 	console.log('Todos');
	// 	console.log(JSON.stringify(docs, undefined, 2));
	// }, (err) => {
	// 	console.log('Unable to fetch todos', err);
	// });

	// query by '_id' value ??? (below is wrong)
	// db.collection('Todos').find({_id: '5c2556c653e9287a39a4e73a'}).toArray().then((docs) => {
	// 	console.log('Todos');
	// 	console.log(JSON.stringify(docs, undefined, 2));
	// }, (err) => {
	// 	console.log('Unable to fetch todos', err);
	// });

	// QUERY the items by object ID
	// NOW YOU CAN USE THE OBJECT ID CONSTRUCTOR FROM BEFORE
	// TO QUERY BY 'OBJECTID'
	/* query todo collection looking for any records 
	that have an _id property equal to
	'5c2556c653e9287a39a4e73a'
	*/
	// db.collection('Todos').find({
	// 	_id: new ObjectID('5c2556c653e9287a39a4e73a')
	// }).toArray().then((docs) => {
	// 	console.log('Todos');
	// 	console.log(JSON.stringify(docs, undefined, 2));
	// }, (err) => {
	// 	console.log('Unable to fetch todos', err);
	// });

	// // COUNT the items
	// db.collection('Todos').find().count().then((count) => {
	// 	console.log(`Todos count: ${count}`);
	// }, (err) => {
	// 	console.log('Unable to fetch todos', err);
	// });

	// query all users where name is 'Jeremiah' in Users collection
	db.collection('Users').find({name: 'Jeremiah'}).toArray().then((users) => {
		console.log('Users');
		console.log(JSON.stringify(users, undefined, 2));
	}, (err) => {
		console.log('Unable to find any users', err);
	});



	// client.close();
});