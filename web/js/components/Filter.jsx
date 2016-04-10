var React = require("react");

var Filter = React.createClass({
  handleChange() {
    this.props.inputHandler(this.props.attribute);
  },

  render() {
    return (
      <span>
      <input
      type="checkbox"
      checked={this.props.isChecked}
      key={this.props.attribute}
      ref={(ref) => this.checkBox = ref}
      onChange={this.handleChange}
      />
      {this.props.attribute}
      </span>
    );
  }
});

module.exports = Filter;
