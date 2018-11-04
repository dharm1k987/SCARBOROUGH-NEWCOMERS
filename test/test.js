// https://mochajs.org
// Run npm start to get the server running then run npm test.
var assert = require('assert');
var axios = require('axios');

describe('Create Account and Login', function() {
  it('#create endpoint', function(done) {
    var data = {
      "username": "Carl",
      "password": "Bryon",
      "type": "TEQ"
    }
    axios.post('http://localhost:8080/create', data)
    .then(function (response) {
      done()
    })
    .catch(function (error) {
      done(error)
    });
  });
});
