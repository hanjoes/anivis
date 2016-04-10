var React = require("react");

var CheckboxItem = React.createClass({
  handleChange() {
  },

  render() {
    return (
      <p>
      <input
      type="checkbox"
      checked="false"
      key={this.props.attribute}
      ref={(ref) => this.checkBox = ref}
      onChange={this.handleChange}
      />
      {this.props.attribute}
      </p>
    );
  }
});

module.exports = CheckboxItem;
