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
  }
};
