var d3 = require('d3');
var React = require("react");

var TreeView = React.createClass({
  componentDidMount() {
    var m = {t:25,b:25,l:0,r:25};
    this.w = 800 - m.l - m.r;
    this.h = 800 - m.t - m.b;

    this.vis = d3.select("#tree")
    .attr("width", this.w + m.l + m.r)
    .attr("height", this.h + m.t + m.b)
    .append("g")
    .attr("transform", "translate(" + m.l + "," + m.t + ")");

    this.force = d3.layout.force()
    .on("tick", this.tick)
    .charge(function(d) { return d._children ? -d.size / 100 : -30; })
    .linkDistance(function(d) { return d.target._children ? 80 : 30; })
    .size([this.w, this.h - 160]);
  },

  visualize() {
    var nodes = this.flatten(this.props.root),
    links = d3.layout.tree().links(nodes);

    // Restart the force layout.
    this.force
    .nodes(nodes)
    .links(links)
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

    // Exit any old links.
    this.link.exit().remove();

    // Update the nodes…
    this.node = this.vis.selectAll("circle.node")
    .data(nodes, function(d) { return d.id; })
    .style("fill", this.color);

    this.node.transition()
    .attr("r", function(d) { return d.children ? 4.5 : Math.sqrt(d.size) / 10; });

    // Enter any new nodes.
    this.node.enter().append("svg:circle")
    .attr("class", "node")
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr("r", function(d) { return d.children ? 4.5 : Math.sqrt(d.size) / 10; })
    .style("fill", this.color)
    .on("click", this.click)
    .call(this.force.drag);

    // Exit any old nodes.
    this.node.exit().remove();
  },

  tick() {
    this.link.attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });

    this.node.attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });
  },

  // Color leaf nodes orange, and packages white or blue.
  color(d) {
    return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
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
    var nodes = [], i = 0;

    function recurse(node) {
      if (node.children) node.size = node.children.reduce(function(p, v) { return p + recurse(v); }, 0);
      if (!node.id) node.id = ++i;
      nodes.push(node);
      return node.size;
    }

    root.size = recurse(root);
    return nodes;
  },

  componentDidUpdate() {
    // this.visualize();
    if (this.props.root) {
      this.root = this.props.root;
      this.root.fixed = true;
      this.root.x = this.w / 2;
      this.root.y = this.h / 2 - 80;
      this.visualize();
    }
  },

  render() {
    return <svg id="tree"></svg>
  }
});

module.exports = TreeView;
