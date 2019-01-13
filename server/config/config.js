var env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
	// load in json file that will not be part of git repository
	// how do we get the values in the ~/config.json ?
	// require json file which auto parses (deserializes) into json object
	var config = require('./config.json'); // need to add json extension
	var envConfig = config[env];

	// Object.keys(envConfig); // returns array of items in object

	// loop over an array of items
	Object.keys(envConfig).forEach((key) => {
		process.env[key] = envConfig[key]; // handles PORT and MONGODB_URI
	});
}

// if (env === 'development') {
// 	// setup mongoDB url
// 	process.env.PORT === 3000;
// 	process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// } else if (env === 'test') {
// 	// also wanna setup custom DB url
// 	process.env.PORT === 3000;
// 	// process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// 	process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/TodoAppTest';
// }
