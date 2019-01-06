// load in the objectId from the mongoDB native driver
const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '5c32654552234b473b76fd1311';

// if (!ObjectID.isValid(id)) {
//   console.log('ID not valid');
// }

// // returns ARRAY
// Todo.find({
//   _id: id // mongoose take this string > convert to obj id > run query
// }).then((todos) => {
//   console.log('Todos', todos);
// });
//
// // first matching doc from mongo
// // returns OBJECT
// Todo.findOne({
//   _id: id // mongoose take this string > convert to obj id > run query
// }).then((todo) => {
//   console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     return console.log('Id not found');
//   }
//   console.log('Todo By Id', todo);
// }).catch((e) => console.log(e));


User.findById('5c31558e9e651b4307cef9af').then((user) => {
  if (!user) {
    return console.log('User not found');
  }
  // pretty print to console
  console.log(JSON.stringify(user, undefined, 2));
}, (e) => {
  console.log(e);
});
