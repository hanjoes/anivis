var d3 = require('d3');
var React = require("react");

var COLORS = {
  0: "#3b4d5f",
  1: "#3061b4",
  2: "#0066a8",
  3: "#006e74"
};

var LINE_COLORS = {
  0: "#cde2ff",
  1: "#cde2ff",
  2: "#a6cbff",
  3: "#4492ff"
}

var previousRoot;

var TreeView = React.createClass({
  componentDidMount() {
    var m = {t:50,b:25,l:0,r:25};
    this.w = 1000 - m.l - m.r;
    this.h = 1000 - m.t - m.b;

    this.vis = d3.select("#tree")
    .attr("width", this.w + m.l + m.r)
    .attr("height", this.h + m.t + m.b)
    .append("g")
    .attr("transform", "translate(" + m.l + "," + m.t + ")");

    this.force = d3.layout.force()
    .on("tick", this.tick)
    .size([this.w, this.h - 160]);

    this.tooltip = d3.select("body").append("div")
    .attr("class", "tooltip");
  },

  visualize() {
    var nodes = this.flatten(this.props.root),
    links = d3.layout.tree().links(nodes);

    // Restart the force layout.
    this.force
    .nodes(nodes)
    .links(links)
    .linkDistance(function(d) {
      if (d.children) {
        return 30;
      }
      return 20;
    })
    .linkStrength(function(d){
      return 0.7;
    })
    .charge(function(d) {
      if (d.children) {
        return -300;
      }
      return -10;
    })
    .start();

    // Update the links…
    this.link = this.vis.selectAll("line.link")
    .data(links, function(d) { return d.target.id; });

    // Enter any new links.
    this.link.enter().insert("svg:line", ".node")
    .attr("class", "link")
    .attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });

    this.link.style("stroke", function(d) {
      var similarity = 0;
      if (d.source["similarity"]) {
        similarity = d.source["similarity"];
      }
      else if (d.target["similarity"]) {
        similarity = d.target["similarity"];
      }
      return LINE_COLORS[similarity];
    });

    // Exit any old links.
    this.link.exit().remove();

    // Update the nodes…
    this.node = this.vis.selectAll("circle.node")
    .data(nodes, function(d) { return d.id; })
    .style("fill", this.color);

    this.node.transition()
    .attr("r", this.nodeRadius);

    // Enter any new nodes.
    this.node.enter().append("svg:circle")
    .attr("class", "node")
    .attr("id", function(d) {
      return "id" + d.id;
    })
    .attr("cx", function(d) {
      return d.x;
    })
    .attr("cy", function(d) {
      return d.y;
    })
    .attr("r", this.nodeRadius)
    .style("fill", this.color)
    .on("click", this.click)
    .on("mouseover", this.mouseover)
    .on("mouseout", this.mouseout)
    .call(this.force.drag);

    // Exit any old nodes.
    this.node.exit().remove();

    this.setupTimer();
  },

  mouseover(datum) {
    this.tooltip.transition()
    .duration(200)
    .style("opacity", .9);

    this.tooltip.html(datum.name)
    .style("left", (d3.event.pageX) + "px")
    .style("top", (d3.event.pageY) + "px");
  },

  mouseout(datum) {
    this.tooltip.transition()
    .duration(500)
    .style("opacity", 0);
  },

  tick() {
    this.node
    .attr("cx", function(d) {
      return d.x;
    })
    .attr("cy", function(d) {
      return d.y;
    });

    this.link
    .attr("x1", function(d) {
      return d.source.x;
    })
    .attr("y1", function(d) {
      return d.source.y;
    })
    .attr("x2", function(d) {
      return d.target.x;
    })
    .attr("y2", function(d) {
      return d.target.y;
    });
  },

  // Calculate the radius of a node.
  nodeRadius(n) {
    if (n._children && n._children.length > 23) {
      return Math.log2(n._children.length * 100);
    }
    return 4.5;
  },

  // Color leaf nodes orange, and packages white or blue.
  color(d) {
    var color = COLORS[d.level];
    if (d["noSimilar"] && d["noSimilar"] == 1) {
      return "#949494";
    }
    else {
      return d._children ? "#3182bd" : d.children ? color : "#fd8d3c";
    }
  },

  // Toggle children on click.
  click(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    this.visualize();
  },

  // Returns a list of all nodes under the root.
  flatten(root) {
    root.level = 0

    var nodes = [], i = 0, parent;

    function recurse(node) {
      if (parent) {
        node.level = parent.level + 1;
      }
      if (node.children) {
        var tmp = parent;
        parent = node;
        node.children.forEach(recurse);
        parent = tmp;
      }
      if (!node.id) node.id = ++i;
      node.isRoot = false;
      node.parent = parent;
      nodes.push(node);
    }
    recurse(root);

    // mark the root node, after recursion, the root
    // should be the last in the list
    if (nodes.length >= 1) {
      this.root = root;
      this.root.isRoot = true
    }

    return nodes;
  },

  shouldComponentUpdate() {
    if (previousRoot == this.props.root) {
      return false;
    }
    return true;
  },

  setupTimer() {
    var _c = this;
    this.props.timer.restart(function(elapsed) {
      var rate = Math.sin(elapsed / 500);
      var radius = 7 * rate + 12;
      d3.select("#id" + _c.root.id).transition()
      .attr("r", radius);
    });
  },

  componentDidUpdate() {
    if (this.props.root) {
      previousRoot = this.root;
      this.root = this.props.root;
      this.root.x = this.w / 2;
      this.root.y = this.h / 2;
      this.visualize();
    }
  },

  render() {
    return <svg id="tree"></svg>
  }
});

module.exports = TreeView;
