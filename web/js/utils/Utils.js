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
  }
};
