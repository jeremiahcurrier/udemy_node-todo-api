// require supertest and expect - nodemon and mocha do not need to be required that is not how they are used
const expect = require('expect');
const request = require('supertest');
// load in the objectId from the mongoDB native driver
const {ObjectID} = require('mongodb');
// local files
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
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
      .set('x-auth', users[0].tokens[0].token)
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
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        // now that todos are associated with users we only expect one todo back
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      // .get('/todos/id')
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should not return todo doc created by other user', (done) => {
    request(app)
      // .get('/todos/id')
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token) // authing as 1st user
      .expect(404)
      // no need for custom expect because no body data back
      // .expect((res) => {
      //   expect(res.body.todo.text).toBe(todos[0].text);
      // })
      .end(done);
  });

  it('should return a 404 if todo not found', (done) => {
    // make request use real objectId using toHexString method
    var hexId = new ObjectID().toHexString();

    // make sure you get a 404 back
    request(app)
      .get(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });



  it('should return 404 for non-object ids', (done) => {
    // /todos/123 valid url but convert to object id fail get 404 back
    request(app)
      .get('/todos/123abc')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    // pass in id that exists in 'todos' collection it does get removed
    var hexId = todos[1]._id.toHexString();
    // send off request
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
    // assert some stuff about it
      .expect(200)
      .expect((res) => {
        //id is id above
        expect(res.body.todo._id).toBe(hexId);
      })
    // query db making sure todo was actually removed from 'todos' collection
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        // make db query using findById hexId should get nothing back
        // todo var in .then call and ensure does not exist via toNotExist assertion
        // request to db fetch todos verifying one was added
        Todo.findById(hexId).then((todo) => {
          // expect(null).toNotExist();
          // except success arg instead of null
          expect(todo).toBeFalsy();
          done();
          // add a .catch case
        }).catch((e) => done(e));
      })
  });

  it('should remove a todo', (done) => {
    var hexId = todos[0]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toBeTruthy();
          done();
        }).catch((e) => done(e));
      })
  });

  it('should return 404 if todo not found', (done) => {
    // code
    // make request use real objectId using toHexString method
    var hexId = new ObjectID().toHexString();
    // make sure you get a 404 back
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if object id is invalid', (done) => {
    // verify that when we have invalid object id we get 404 back as expected
    // /todos/123 valid url but convert to object id fail get 404 back
    request(app)
      .delete('/todos/123abc')
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  // 2 test cases
  // take our 1st todo and set text to something else and completed from false to true
  it('should update the todo', (done) => {
    // grab id of first item
    var hexId = todos[0]._id.toHexString();
    var text = 'This should be the new text';
      // make request to express application
      request(app)
        .patch(`/todos/${hexId}`) // url with template string
        .set('x-auth', users[0].tokens[0].token)
        .send({
          // send data before making assertions
          completed: true,
          // text: text
          text // es6
        })
        .expect(200) // assert 200
        .expect((res) => {
          expect(res.body.todo.text).toBe(text);
          expect(res.body.todo.completed).toBe(true);
          expect(typeof res.body.todo.completedAt).toBe('number');
        })
        // BEFORE CUSTOM ASSERTION - call end
        .end(done);
  });

  it('should not update the todo created by other user', (done) => {
    var hexId = todos[0]._id.toHexString();
    var text = 'This should be the new text';

    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        completed: true,
        text
      })
      .expect(404)
      .end(done);
  });

  // toggling that completed value for the second todo
  it('should clear completedAt when todo is not completed', (done) => {
    // grab id of second item
    var hexId = todos[1]._id.toHexString();
    var text = 'patched up real nice';
    // make request to express application
    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      // send the data before you can make the assertion about its response
      .send({
        completed: false,
        text
      })
      // expect http 200 ok
      .expect(200)
      // custom assertion text changed, completed false, completedAt is null via .toNotExist
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBeFalsy();
      })
      .end(done);
  });
});

describe('GET /users/me', () => {
  // valid auth token
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      // SET a header
      .set('x-auth', users[0].tokens[0].token)
      // should get back a http 200
      .expect(200)
      // some things about the body
      .expect((res) => {
        // id in body should be id of user whose token we applied
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      // tack on a call to .end()
      .end(done);
  });

  // invalid auth token
  it('should return a 401 if not authenticated', (done) => {
    // users/me route, same GET, no x-auth token, expect a 401, body = {} since user not authed, call .end(done); toEqual
    request(app)
      .get('/users/me')
      .expect(401)
      // some things about the body
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', () => {
  // 3 cases
  it('should create a user', (done) => {
    var email = 'example@example.com';
    var password = '123mnb!';

    request(app)
      .post('/users')
      // send some data
      .send({email, password})
      // what should happen?
      // expect 200 status back
      .expect(200)
      // get x-auth token back
      .expect((res) => {
        // no errors expected
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      // now we can call end
      // .end(done);
      // but instead of passing in done pass in a custom function to query the database
      .end((err) => {
        if (err) {
          return done(err);
        }

        User.findOne({email}).then((user) => {
          // make some assertions about the document in the DB
          // toExist -> toBeTruthy
          expect(user).toBeTruthy();
          // toNotBe -> not.toBe
          expect(user.password).not.toBe(password); // if equal then passwords not getting hashed = problem
          done();
        }).catch((e) => done(e)); // like all async tests tack on catch call to catch error that might occur if things are not equal
      });
  });

  it('should return validation errors if request invalid', (done) => {
    request(app)
      .post('/users')
      // send invalid email and invalid password
      .send({
        email: 'foo',
        password: 'bar'
      })
    // expect 400
      .expect(400)
    // done
      .end(done);
  });

  it('should not create a user if email in use', (done) => {
    request(app)
      .post('/users')
    // email already taken (i.e. already in seed data)
      .send({
        email: users[0].email, // supposed to be VALID but already in use
        password: 'Password123!' // valid format for password
      })
    // expect 400
      .expect(400)
    // done
      .end(done);
  });
});


describe('POST /users/login', () => {
  // this test fails
    it('should login user and return auth token', (done) => {
      request(app)
        .post('/users/login')
        .send({
          email: users[1].email,
          password: users[1].password
        })
        .expect(200) // Error: expected 200 "OK", got 400 "Bad Request"
        .expect((res) => {
          expect(res.headers['x-auth']).toBeTruthy();
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          User.findById(users[1]._id).then((user) => {
            expect(user.toObject().tokens[1]).toMatchObject({
              access: 'auth',
              token: res.headers['x-auth']
            });
            done();
          }).catch((e) => done(e));
        });
    });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password + '1'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeFalsy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(1);
          done();
        }).catch((e) => done(e));
      });
  });
});

// pass in route signature
describe('DELETE /users/me/token', () => {
  // make sure when real valid x-auth token is passed along to the logout method it actually gets logged out
  it('should remove auth token on logout', (done) => {
    // we need seed data
    request(app)
    // DELETE /users/me/token
      .delete('/users/me/token')
    // Set x-auth to token in tokens array
      .set('x-auth', users[0].tokens[0].token)
    // some assertions
    // expect 200 back
      .expect(200)
    // add async .end() call to make an async assertion
    // find user, verify that tokens array has length of 0
      .end((err, res) => {
        // handle the error
        if (err) {
          return done(err); // pass error to done function
        }
        // query our database
        User.findById(users[0]._id).then((user) => {
          // assertion
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      // }).catch((e) => {
      //   done(e);
      // });
      });

  });
});
