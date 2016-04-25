var d3 = require('d3');

var BASE = 'db';


var FILTER_INIT = {
  "filters":
  [
    {"name": "Types", "message": "select a type", "preset": ["anime", "manga"]},
    {"name": "Media", "message": "select a media", "preset": []},
    {"name": "Genres", "message": "select a genre", "preset": []},
    {"name": "Themes", "message": "select a theme", "preset": []}
  ]
};

var FILETONAME_MAP = [
  {"filename": "genre.json", "filtername": "Genres"},
  {"filename": "media.json", "filtername": "Media"},
  {"filename": "theme.json", "filtername": "Themes"}
];


module.exports = {

  getInitialFilterStates(callback) {
    callback && callback(FILTER_INIT);
  },

  getCategoriesForType(selectedOption, callback) {
    FILETONAME_MAP.forEach(function(mapping) {
      var path = BASE + "/" + selectedOption + "/" + mapping["filename"];
      var filterName = mapping["filtername"];
      d3.json(path, function(data) {
        callback && callback(data, filterName);
      });
    });
  },

  getFilteredData(filters, callback) {
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
