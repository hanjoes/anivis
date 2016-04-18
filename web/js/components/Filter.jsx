var React = require("react");

var Filter = React.createClass({
  handleChange() {
    var selector = this._selector;
    var selectedCategory = selector[selector.selectedIndex].value
    this.props.inputHandler(this.props.attribute, selectedCategory);
  },

  render() {
    var options = [];
    var allKey = this.props.attribute + "_all";
    options.push(
      <option value={allKey} key={allKey}>
          all
      </option>
    );
    this.props.categories.forEach(function(categoryStat) {
      for (var key in categoryStat) {
        if (categoryStat.hasOwnProperty(key)) {
          options.push(
            <option value={key} key={key}>
              {key}
            </option>
          );
        }
      }
    });
    return (
      <span>
        {this.props.attribute}:
        <select onChange={this.handleChange} ref={(c) => this._selector = c}>
          {options}
        </select>
      </span>
    );
  }
});

module.exports = Filter;
