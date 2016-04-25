var d3 = require('d3');

var base = 'data/json'

module.exports = {

  getAttributes(callback) {
    d3.json(base + '/filters.json', (data) => {
      callback && callback(data);
    });
  },

  getFilteredData(filters, callback) {
    // build the path first
    // var path = base;
    // filters.forEach(function(filter) {
    //   path = path + '/' + filter;
    // });
    //
    // d3.json(path + 'anime.json', (data) => {
    //   callback && callback(data);
    // });

    d3.json("../../data/json/anime.json", function(data) {
      callback && callback(data);
    });
  },

  getRankedAnimes(callback) {
    d3.json("../../data/json/ratings.json", function(data) {
      callback && callback(data);
    });
  }

};
