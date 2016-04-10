var d3 = require('d3');

module.exports = {

  getAttributes(callback) {
    d3.json('data/json/filters.json', (data) => {
      callback && callback(data);
    });
  }

};
