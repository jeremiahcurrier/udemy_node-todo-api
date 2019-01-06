// require supertest and expect - nodemon and mocha do not need to be required that is not how they are used
const expect = require('expect');
const request = require('supertest');
// local files
const {app} = require('./../server');
const {Todo} = require('./../models/todo');

// add TESTING LIFECYCLE METHOD
beforeEach((done) => {
  // run before every test case
  Todo.remove({}).then(() => done()); // wipe out our todos
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
        Todo.find().then((todos) => {
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
          expect(todos.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  })

});
