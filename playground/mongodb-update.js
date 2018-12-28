// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
	if (err) {
		return console.log('Unable to connect to MongoDB server');
	}
	console.log('Connected to MongoDB server');
	const db = client.db('TodoApp');

	/*
	findOneAndUpdate(filter, update, options, callback)
	https://docs.mongodb.com/manual/reference/method/db.collection.findOneAndUpdate/
	returns a promise
	*/
		/* mongodb update operators 
		https://docs.mongodb.com/manual/reference/operator/update/
		will work with all drivers
		including node.js driver for mongodb
		we want the 'SET' operators
		$INC is another good one to increment a number value
		*/

	// // findOneAndUpdate (update item and return new document)
	// db.collection('Todos').findOneAndUpdate({
		// _id: new ObjectID('5c266d2e6cd2860837ca6eb7')
	// }, {
	// 	$set: {
	// 		completed: true
	// 	}
	// }, {
	// 	returnOriginal: false
	// }).then((result) => {
	// 	console.log(result);
	// 	// includes 'value' prop in response
	// });

	// findOneAndUpdate (name and age)
	db.collection('Users').findOneAndUpdate({
		name: 'Jaaay'
		// _id: new ObjectID('5c266d2e6cd2860837ca6eb7')
	}, {
		// $set: {
		// 	name: 'Jaaay'
		// },
		$inc: {
			// age: +1
			age: 1
		}
	}, {
		returnOriginal: false
	}).then((result) => {
		console.log(result);
		// check value prop...
	});

	// client.close();
});

/* the real goal is you writing your own code, 
doing your own research, and reading your 
own documentation */