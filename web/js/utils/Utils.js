module.exports = {

  pointOneCeil(val) {
    return Math.ceil(val * 10) / 10;
  },

  pointOneFloor(val) {
    return Math.floor(val * 10) / 10;
  },

  getSortedFieldsList(obj) {
    var fieldList = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        fieldList.push(key);
      }
    }
    fieldList.sort();
    return fieldList;
  },

  distance(n1, n2) {
    return Math.sqrt((n1.x - n2.x) * (n1.x - n2.x), (n1.y - n2.y) * (n1.y - n2.y));
  },

  isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true && JSON.stringify(obj) === JSON.stringify({});
  },

  // This builds a tree which feeds the force layout.
  // The tree will only have tree levels.
  buildForceTree(animes) {
    // Root (1st level)
    var resultObj = {
      "name": "similars",
      "isRoot": "yes",
      "children": [],
      "level": 0
    };

    // Animes matching (2nd level)
    animes.forEach(function(anime) {

      var animeItem = {
        "name": anime["name"],
        "children": [],
        "level": 1,
        "isAnime": 1
      };
      // Similar animes (3rd level)
      anime["similar"].forEach(function(similarAnime) {
        var similarItem = {
          "name": similarAnime["name"],
          "level": 2,
          "similarity": similarAnime["similar"],
          "isAnime": 1
        };
        animeItem["children"].push(similarItem);
      });

      if (animeItem["children"].length == 0) {
        animeItem["noSimilar"] = 1;
      }

      resultObj["children"].push(animeItem);

    });

    return resultObj
  }
};
