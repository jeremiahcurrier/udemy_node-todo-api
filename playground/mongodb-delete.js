// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
	if (err) {
		return console.log('Unable to connect to MongoDB server');
	}
	console.log('Connected to MongoDB server');
	const db = client.db('TodoApp') // 'db' reference

	// // deleteMany (many documents)
	// db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
	// 	// if (err) {
	// 	// 	return console.log('Error deleting many documents', err);
	// 	// }
	// 	console.log(result);
	// 	/* response is huge but all
	// 	you need is the 'result' object
	// 	i.e.
	// 	result: { n: 3, ok: 1 },
	// 	'result' obj includes 'n' and 'ok'
	// 	properties
	// 	*/
	// });
	
	// // deleteOne (1 doc)
	// db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
	// 	// if (err) {
	// 	// 	return console.log('Error deleting one document', err);
	// 	// }
	// 	console.log(result);
	// 	/* 'result' obj includes 'n' and 'ok'
	// 	properties */
	// });
	
	// // findOneAndDelete (remove item and return value/obj back)
	// db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
	// 	// if (err) {
	// 	// 	return console.log('Error finding and deleting one', err);
	// 	// }
	// 	/* instead of just getting
	// 	a 'result' obj with 'n' and 'ok'
	// 	properties you actually get the
	// 	entire document back */
	// 	console.log(result);
	// });


// CHALLENGE
	// // deleteMany (many documents)
	// db.collection('Users').deleteMany({name: 'Jeremiah'}).then((result) => {
	// 	console.log(result);
	// });
// success
// another option	
	// // // deleteMany (many documents)
	// db.collection('Users').deleteMany({name: 'Jeremiah'});


// //CHALLENGE
// 	db.collection('Users').findOneAndDelete({
// 		_id: new ObjectID('5c255810c748f57b593a98b0')
// 	}).then((result) => {
// 		console.log(result);
// 	});
// // success


	// client.close();
});