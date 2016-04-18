var d3 = require('d3');
var React = require('react');

var RankingView = React.createClass({
  componentDidMount() {
    var m = {t:25,b:25,l:25,r:25};
    var w = 500 - m.l - m.r;
    var h = 1000 - m.t - m.b;

    var rect = {w: w, h: h};

    var vis = d3.select("#ranking")
    .attr("width", w + m.l + m.r)
    .attr("height", h + m.t + m.b)
    .append("g")
    .attr("transform", "translate(" + m.l + "," + m.t + ")");

    var rects = vis.selectAll("rect").data([rect]).enter().append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", function(d) { return d.w; })
    .attr("height", function(d) { return d.h; });
  },

  render() {
    return <svg id="ranking"></svg>
  }
});

module.exports = RankingView;
