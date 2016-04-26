var d3 = require('d3');

var BASE = 'db';


var FILTER_INIT = {
  "filters":
  [
    {"name": "Types", "message": "select a type", "preset": ["anime", "manga"], "selected": ""},
    {"name": "Media", "message": "select a media", "preset": [], "selected": ""},
    {"name": "Genres", "message": "select a genre", "preset": [], "selected": ""},
    {"name": "Themes", "message": "select a theme", "preset": [], "selected": ""}
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
    var url = BASE;
    filters.forEach(function(filter) {
      var selected = filter["selected"];
      if (selected && selected.length > 0 && selected !== "default") {
        url += "/" + filter["selected"];
      }
    });
    url += "/anime.json";

    console.log(url);
    d3.json(url, function(data) {
      console.log(data);
      callback && callback(data);
    });

    // d3.json("data/json/anime.json", function(data) {
    //   console.log(data);
    //   callback && callback(data);
    // });
  },

  getRankedAnimes(callback) {
    d3.json(BASE + "/anime/rating.json", function(data) {
      callback && callback(data);
    });
  }

};
