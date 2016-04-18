var d3 = require('d3');
var React = require('react');

var vis, w, h, yScale, yAxis, yAxisGroup, indexByDomain;

var RECT_HORIZONTAL_PADDING = 15;

var RankingView = React.createClass({
  componentDidMount() {
    var m = {t:25,b:25,l:25,r:25};
    w = 200 - m.l - m.r;
    h = 800 - m.t - m.b;

    vis = d3.select("#ranking")
    .attr("width", w + m.l + m.r)
    .attr("height", h + m.t + m.b)
    .append("g")
    .attr("transform", "translate(" + m.l + "," + m.t + ")");

    indexByDomain = {};
    yScale = d3.scale.linear().range([h, 0]);

    yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .ticks(5, "s")
    .outerTickSize(1);
    yAxisGroup = vis.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(10,0)");
  },

  componentDidUpdate() {
    if (!this.props.ranks) {
      return;
    }
    var ratings = this.props.ranks["ratings"];
    var lo = 0;
    var hi = ratings.length - 1;
    var minmax = this.minmaxWithinIndices(ratings, lo, hi);
    if (minmax && minmax.length == 2) {
      var minRating = minmax[0];
      var maxRating = minmax[1];
      var yDomain = [minRating, maxRating];
      yScale.domain(yDomain);
      yAxisGroup.call(yAxis);

      // initialize indexByDomain
      this.insertIndexByRange(minmax, lo, hi);

      this.visualize();
    }
  },

  insertIndexByRange(minmax, lo, hi) {
    if (minmax && minmax.length == 2) {
      var minRating = minmax[0];
      var maxRating = minmax[1];
      var key = minRating.toString() + "_" + maxRating.toString();
      indexByDomain[key] = [lo, hi];
    }
  },

  // get min/max rating within range specified by lo and hi, inclusive
  minmaxWithinIndices(ratings, lo, hi) {
    if (ratings.length < 1) {
      return [];
    }

    var minRating = ratings[lo]["rating"];
    var maxRating = ratings[lo]["rating"];
    for (var i = lo + 1; i <= hi; ++i) {
      var cur = ratings[i]["rating"];
      if (cur < minRating) {
        minRating = cur;
      }
      if (cur > maxRating) {
        maxRating = cur;
      }
    }
    return [minRating, maxRating];
  },

  visualize() {
    console.log("visualizing: ");
    console.log(indexByDomain);
    var rects = [];
    // get all rectangles for update
    for (var key in indexByDomain) {
      if (indexByDomain.hasOwnProperty(key)) {
        var parts = key.split("_");
        if (parts.length == 2) {
          var lo = parts[0];
          var hi = parts[1];
          var yMin = yScale(hi);
          var yMax = yScale(lo);
          rects.push({x: 0, y: yMin, w: w, h: yMax - yMin, lo: lo, hi: hi});
        }
      }
    }
    this.visualizeRects(rects);
  },

  visualizeRects(rectData) {
    var rects = vis.selectAll("rect").data(rectData);

    var hp = RECT_HORIZONTAL_PADDING;

    var ratings = this.props.ranks["ratings"];
    var component = this;
    rects.enter()
    .append("rect")
    .attr("class", "rankingRect")
    .on("click", function(d) {
      var key = d.lo + "_" + d.hi;
      var indices = indexByDomain[key];
      delete indexByDomain[key];
      // delete the original range, and insert two new ranges that
      // are halves from the original range
      var ilo = indices[0], ihi = indices[1], mid = Math.floor((ilo + ihi) / 2);
      var minmaxLo = component.minmaxWithinIndices(ratings, ilo, mid);
      component.insertIndexByRange(minmaxLo, ilo, mid);
      var minmaxHi = component.minmaxWithinIndices(ratings, mid, ihi);
      component.insertIndexByRange(minmaxHi, mid, ihi);

      component.visualize();
    });

    rects.exit().transition().duration(1000).remove();

    rects.transition().duration(1000)
    .attr("x", function(d) { return d.x + hp; })
    .attr("y", function(d) { return d.y; })
    .attr("width", function(d) { return d.w - 2 * hp; })
    .attr("height", function(d) { return d.h; })
    .attr("fill", "purple")
    .attr("stroke", "black")
  },

  render() {
    return <svg id="ranking"></svg>
  }
});

module.exports = RankingView;
