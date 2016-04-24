var d3 = require('d3');
var React = require('react');
var Utils = require('../utils/Utils');

var vis, w, h, yScale, yAxis, yAxisGroup, indexByDomain, tooltip, redScale;

var RECT_HORIZONTAL_PADDING = 15;
var RED_DOMAIN_HI = 5;

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
    yScale = d3.scale.linear().range([h, 0]).domain([0, 10]);
    redScale = d3.scale.linear().range([0, 128]).domain([0, RED_DOMAIN_HI]);

    yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .ticks(10, "s");

    yAxisGroup = vis.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(10,0)").call(yAxis);

    yAxisGroup.selectAll("line").data(yScale.ticks(100), function(d) { return d; })
    .enter()
    .append("line")
    .attr("class", "minor")
    .attr("x1", 0)
    .attr("y1", yScale)
    .attr("x2", -3)
    .attr("y2", yScale);

      yAxisGroup.call(yAxis);
    tooltip = d3.select("body").append("div" )
    .attr("id", "detail")
    .style("opacity", 0);
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
    var rects = [];
    // get all rectangles for update
    var fieldList = Utils.getSortedFieldsList(indexByDomain);
    console.log(indexByDomain);
    console.log(fieldList);
    for (var i = 0; i < fieldList.length; ++i) {
      var key = fieldList[i];
      if (indexByDomain.hasOwnProperty(key)) {
        var parts = key.split("_");
        if (parts.length == 2) {
          var lo = parts[0];
          var hi = parts[1];
          var hiVal = Utils.pointOneCeil(hi);
          var loVal = Utils.pointOneFloor(lo);
          if (hiVal == loVal) {
            loVal -= .1
          }
          var yMin = yScale(hiVal);
          var yMax = yScale(loVal);
          var num = indexByDomain[key][1] - indexByDomain[key][0] + 1;
          rects.push({x: 0, y: yMin, w: w, h: yMax - yMin, lo: lo, hi: hi, n: num});
        }
      }
    }
    this.visualizeRects(rects);
  },

  getAnimeList(ratings, lo, hi) {
    var items = ""
    for (var i = lo; i <= hi; ++i) {
      ratings[i]
      items += this.getAnimeListItem(ratings[i])
    }
    return "<ul>" + items + "</ul>"
  },

  findDivideIndex(ratings, lo, hi) {
    var mid = Math.floor(lo + (hi - lo) / 2);
    var midVal = ratings[mid]["rating"];
    // find the smallest value that is greater than Utils.pointOneCeil(midVal)
    // eventually mid should pointing to this value, since for a range
    // displayed it doesn't include the lower bound.
    var result = mid;
    var loVal = Utils.pointOneFloor(midVal);
      console.log("howdy");
    if (ratings[mid]["rating"] > loVal) {
      var prev = result;
      console.log("howdy");
      while (result <= hi && ratings[result]["rating"] > loVal) {
        prev = result;
        result += 1;
      }
      console.log("result: " + result);
      result = prev;
    }
    else {// could only be equal
      // search backward
      var tmp = result;
      while (result >= 0 && ratings[result]["rating"] == loVal) {
        result -= 1;
      }
      if (result >= 0) return result;
      // search forward
      while (tmp <= hi && ratings[tmp]["rating"] == loVal) {
        tmp += 1
      }
      if (tmp <= hi) result = tmp;
    }
    return result
  },

  getAnimeListItem(ratingItem) {
    return "</br><li>" + ratingItem["anime"]["name"] + "</li>"
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
      // delete the original range, and insert two new ranges that
      // are halves from the original range
      var ilo = indices[0], ihi = indices[1], mid = component.findDivideIndex(ratings, ilo, ihi)
      console.log("ilo: " + ilo + " ihi: " + ihi + " mid: " + mid);
      if (ilo < ihi && mid + 1 <= ihi && ilo <= mid) {
        delete indexByDomain[key];

        var minmaxLo = component.minmaxWithinIndices(ratings, ilo, mid);
        component.insertIndexByRange(minmaxLo, ilo, mid);

        var minmaxHi = component.minmaxWithinIndices(ratings, mid + 1, ihi);
        component.insertIndexByRange(minmaxHi, mid + 1, ihi);

        component.visualize();
      }
    })
    .on("mouseover", function(d) {
      var key = d.lo + "_" + d.hi;
      var indices = indexByDomain[key];
      tooltip.transition().duration(200).style("opacity", .9);
      var detailList = component.getAnimeList(ratings, indices[0], indices[1]);
      tooltip.html(detailList);
    });

    rects.exit().transition().duration(1000).remove();

    rects.attr("fill", "purple");

    rects.transition().duration(1000)
    .attr("x", function(d) { return d.x + hp; })
    .attr("y", function(d) { return d.y; })
    .attr("width", function(d) { return d.w - 2 * hp; })
    .attr("height", function(d) { return d.h; })
    .attr("fill", function(d) {
      var num = Math.min(RED_DOMAIN_HI, d.n)
      return "rgb(" + redScale(num) + ",0,128)";
    })
    .attr("stroke", "black")
  },

  render() {
    return <svg id="ranking"></svg>
  }
});

module.exports = RankingView;
