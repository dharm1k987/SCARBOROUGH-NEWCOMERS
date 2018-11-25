var axios = require('axios');

module.exports  = function(app) {
    // add in the inital accounts
    let data = {
        "username": "caleb",
        "password": "caleb",
        "type": "TEQ"
      }
      axios.post('http://localhost:8080/create', data)
      .then(function (response) {
        // there doesn't need to be anything in here
      })
      .catch(function (error) {
        
      });

      data = {
        "username": "ralph",
        "password": "qwe",
        "type": "org"
      }
      axios.post('http://localhost:8080/create', data)
      .then(function (response) {
        
      })
      .catch(function (error) {
        
      });

};
