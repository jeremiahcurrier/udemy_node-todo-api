var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
	text: {
		type: String,
		required: true,
		minLength: 1,
		trim: true
	},
	completed: {
		type: Boolean,
		default: false
	},
	completedAt: {
		type: Number,
		default: null
	},
		// _creator  // _* = ObjectID
	_creator: { // this is a property
		// go into mongoose > access Schema > access Types object and on there there is a type of 'ObjectID'
		type: mongoose.Schema.Types.ObjectId,// set something to an ObjectID
		required: true // cant create a todo unless logged in
	}

});

// export the Todo model
module.exports = {Todo};
