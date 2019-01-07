var env = process.env.NODE_ENV || 'development';

if (env === 'development') {
	// setup mongoDB url
	process.env.PORT === 3000;
	process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test') {
	// also wanna setup custom DB url
	process.env.PORT === 3000;
	// process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
	process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/TodoAppTest';
}
