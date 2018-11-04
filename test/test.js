// https://mochajs.org
// Run npm start to get the server running then run npm test.
var assert = require('assert');
var axios = require('axios');

describe('Test Create Account', function() {
  it('#create POST endpoint', function(done) {
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


describe('Test Account Type', function() {
  it('#/account/type GET endpoint', function(done) {
    data = {
      params: {
        username: "Carl",
        password: "Bryon"
      }
    }
    axios.get('http://localhost:8080/account/type', data)
    .then(function (response) {
      done()
    })
    .catch(function (error) {
      done(error)
    });
  });
});

describe('Test Fill DB', function() {
  it('#/fill POST endpoint', function(done) {
    axios.post('http://localhost:8080/fill', {})
    .then(function (response) {
      done()
    })
    .catch(function (error) {
      done(error)
    });
  });

  it('#/fill GET endpoint', function(done) {
    data = {
      params: {
        "username": "test1", "password": "testpass"
      }
    }
    axios.get('http://localhost:8080/fill', data)
    .then(function (response) {
      done()
    })
    .catch(function (error) {
      done(error)
    });
  });
});

// TODO: This test is probs broken.
describe('Test Create Account and Log In', function() {
  it('#create POST endpoint', function(done) {
    var data = {
      "username": "Carl",
      "password": "Bryon",
      "type": "TEQ"
    }
    axios.post('http://localhost:8080/create', data)
    .then(function (response) {
        axios.post('http://localhost:8080/login', data)
        .then(function (response) {
          done()
        })
        .catch(function (error) {
          done(error)
        });
        done();
    })
    .catch(function (error) {
      done(error)
    });
  });

});

describe('Test Upload File', function() {
  // None Yet.
});
