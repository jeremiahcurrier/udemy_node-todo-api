// grab prop off require return result
const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

// // hash a password using bcrypt
// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash);
//   });
// });

// how to compare if the hash = plain text password (when someone logs in)
var hashedPassword = '$2a$10$NGZVeZ2kSczQOE6e/HlSSuuNIn1YfH5OJ3FQ0Pb9YNEvAT7U1ULh2';

bcrypt.compare('password', hashedPassword, (err, res) => {
  // res is true or false
  console.log(res);
});







// https://jwt.io/

// create token
// verify it

    // var data = {
    //   id: 10
    // };
    // var token = jwt.sign(data, '123abc');
    // console.log(token);
    // // jwt.sign // takes obj (data w user id), signs it, returns token value
    // // jwt.verify // takes token + secret to ensure data not manipulated (shared secret)
    // // var decoded = jwt.verify(token + '1', '123abc');
    // // var decoded = jwt.verify(token, '123abcc');
    // var decoded = jwt.verify(token, '123abc');
    // console.log('decoded', decoded);





// var message = 'I am user number 3';
// var hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// // JWT concept
// var data = {
//   id: 4
// };
// // var token = {
// //   data,
// //   hash: SHA256(JSON.stringify(data)).toString()
// // }
// // token not foolproof... let's say user changes the data.id property to 5 all they have to do is re-hash that data > add it on to the 'hash' property > send the 'token' back and they technically could trick us... HOW TO PREVENT THIS?
// // 'salt the hash' === add something onto the hash that's unique that changes the value
// // password + somesecret
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString() // somesecret is only on the server...
// }
//
// // mocks up a hash manipulation
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if (resultHash === token.hash) {
//   // data not manipulated bc of the salt
//   console.log('Data was not changed');
// } else {
//   // data was changed, do not trust, likely incorrect/malicious
//   console.log(('Data was changed. Do not trust.'));
// }
