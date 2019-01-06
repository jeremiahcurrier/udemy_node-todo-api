// require supertest and expect - nodemon and mocha do not need to be required that is not how they are used
const expect = require('expect');
const request = require('supertest');
// load in the objectId from the mongoDB native driver
const {ObjectID} = require('mongodb');
// local files
const {app} = require('./../server');
const {Todo} = require('./../models/todo');


// ADD SEED DATA
// dummy todos
const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo'
}];


// add TESTING LIFECYCLE METHOD
beforeEach((done) => {
  // run before every test case
  // Todo.remove({}).then(() => done()); // wipe out our todos
  // insertMany (takes array and inserts into collection)
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

// group all routes
describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        // handle any errors that occured above &&
        if (err) {
          return done(err); // return result to stop f(x) execution
        }

        // request to db fetch todos verifying one was added
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

// verify todo does not get created if we send bad data expect 400 with error obj
  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  })

});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      // .get('/todos/id')
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return a 404 if todo not found', (done) => {
    // make request use real objectId using toHexString method
    var hexId = new ObjectID().toHexString();
    // make sure you get a 404 back
    request(app)
      .get(`/todos/${hexId}`)
        .expect(404)
        .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    // /todos/123 valid url but convert to object id fail get 404 back
    request(app)
      .get('/todos/123abc')
        .expect(404)
        .end(done);
  });
});
