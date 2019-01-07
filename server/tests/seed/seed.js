// imports
// load in the objectId from the mongoDB native driver
const {ObjectID} = require('mongodb'); // using es6 destructuring
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
  _id: userOneId,
  email: 'andrew@example.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'secretvalue').toString()
  }]
}, {
  _id: userTwoId,
  email: 'jen@example.com',
  password: 'userTwoPass'
}];

// ADD SEED DATA
// dummy todos
const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333
}];

const populateTodos = (done) => {
  // run before every test case
  // Todo.remove({}).then(() => done()); // wipe out our todos
  // insertMany (takes array and inserts into collection)
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos); // this does not run our middleware
  }).then(() => done());
};

// we need to save the users AND ensure passwords are hashed
const populateUsers = (done) => {
  User.remove({}).then(() => {
    // add records
    // var userOne = new User(users[0].save()); // returns a promise
    // var userTwo = new User(users[1].save()); // returns a promise
    // // we wanna wait for BOTH promises to finish
    // // Promise.all([userOne, userTwo]).then(() => {
    // //   // code
    // // });
    // return Promise.all([userOne, userTwo]);
    return User.insertMany(users);
  }).then(() => done());
};

// export
module.exports = {todos, populateTodos, users, populateUsers};
