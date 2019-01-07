const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Mongoose methods
// Todo.remove({}) // can't pass empty argument! / no get docs back just number back
// Todo.remove({}).then((result) => {
//   console.log(result);
// });

// Todo.findOneAndRemove // returns doc
// Todo.findOneAndRemove({_id: '5c329cd1ff0fb03dffbe5716'}).then((todo) => {
//   console.log(todo);
// });

// Todo.findByIdAndRemove // returns doc

Todo.findByIdAndRemove('5c329cd1ff0fb03dffbe5716').then((todo) => {
  console.log(todo);
});
