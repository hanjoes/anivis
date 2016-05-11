var React = require("react");

var Filter = React.createClass({
  handleChange() {
    var select = this._select;
    var selectedCategory = select[select.selectedIndex].value
    this.props.inputHandler(this.props.filter, selectedCategory);
  },

  getOneOption(filter, value, first = false) {
    var message = filter["message"];
    return (
      <option value={value} key={filter["name"] + "_" + value}>
      {first ? message : value}
      </option>
    )
  },

  render() {
    var _c = this;
    var options = [];
    var filter = this.props.filter;
    var categories = this.props.categories;

    // initialize the "none" option
    options.push(_c.getOneOption(filter, "default", true));

    // initialize any preset option
    var preset = filter["preset"]
    preset && preset.forEach(function(category) {
      options.push(_c.getOneOption(filter, category));
    });

    // initialize other options from data
    categories && categories.forEach(function(category) {
      options.push(_c.getOneOption(filter, category));
    });

    return (
      <span>
      {filter["name"]}:
      <select class="filters" onChange={this.handleChange} ref={(c) => this._select = c} value={filter["selected"]}>
      {options}
      </select>
      </span>
    );
  }
});

module.exports = Filter;
