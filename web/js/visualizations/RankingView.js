var d3 = require('d3');

module.exports = {
  visualize() {
    var m = {t:25,b:25,l:25,r:25};
    var w = 500 - m.l - m.r;
    var h = 1000 - m.t - m.b;

    var rect = {w: w, h: h};

    var svg = d3.select("#ranking")
    .attr("x", 1025)
    .attr("width", w + m.l + m.r)
    .attr("height", h + m.t + m.b)
    .append("g")
    .attr("transform", "translate(" + m.l + "," + m.t + ")");

    var rects = svg.selectAll("rect").data([rect]).enter().append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", function(d) { return d.w; })
    .attr("height", function(d) { return d.h; });
  }
};
