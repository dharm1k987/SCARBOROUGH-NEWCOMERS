// https://mochajs.org
// Run npm start to get the server running then run npm test.
var assert = require('assert');
var axios = require('axios');
var expect = require('expect.js');
var mlog = require('mocha-logger');

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

  it('#create POST endpoint When Account Already Exists', function(done) {
    var data = {
      "username": "Carl",
      "password": "Bryon",
      "type": "TEQ"
    }
    axios.post('http://localhost:8080/create', data)
    .then(function (response) {
      done(response)
    })
    .catch(function (error) {
      done(false) // Means Don't Mark test as failed because it should fail.
    });
  });

  it('#delete POST endpoint', function(done) {
    var data = {
      "username": "Carl",
      "password": "Bryon"
    }
    axios.post('http://localhost:8080/account/delete', data)
    .then(function (response) {
      done()
    })
    .catch(function (error) {
      done(error)
    });
  });
});


describe('Test Account Type', function() {

  it('#create POST endpoint', function(done) {
    var data = {
      "username": "Carls",
      "password": "Bryons",
      "type": "TEQ"
    }
    axios.post('http://localhost:8080/create', data)
    .then(function (response) {
      axios.get('http://localhost:8080/account/type', data)
      .then(function (response) {
        done()
      })
      .catch(function (error) {
        done(false)
      });
    })
    .catch(function (error) {
      done(false)
    });
  });


  it('#delete POST endpoint', function(done) {
    var data = {
      "username": "Carls",
      "password": "Bryons"
    }
    axios.post('http://localhost:8080/account/delete', data)
    .then(function (response) {
      done()
    })
    .catch(function (error) {
      done(error)
    });
  });
});

describe('Test Account Type When Account Does not exist', function() {
  it('#/account/type GET endpoint', function(done) {
    data = {
      params: {
        username: "dharmikLads",
        password: "BryonNee"
      }
    }
    axios.get('http://localhost:8080/account/type', data)
    .then(function (response) {
      expect(response).to.be(300);
    })
    .catch(function (error) {
      done()
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


describe('Test Create Account and Log In', function() {

  it('#create POST endpoint', function(done) {
    var data = {
      "username": "Carle",
      "password": "Bryone",
      "type": "TEQ"
    }
    axios.post('http://localhost:8080/create', data)
    .then(function (response) {
        axios.post('http://localhost:8080/login', data)
        .then(function (response) {
          axios.post('http://localhost:8080/account/delete', data)
          .then(function (response) {
            done()
          })
          .catch(function (error) {
            done(error)
          });
        })
        .catch(function (error) {
          done(error)
        });
    })
    .catch(function (error) {
      done(false)
    });
  });

});

describe('Test Upload File', function() {
  // None Yet.
});
