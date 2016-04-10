var React = require('react');

var Filter = React.createClass({
  handleChange() {
  },

  render() {
    return (
      <form>
      <p>
      <input
      type="checkbox"
      checked="true"
      ref={(ref) => this.typeCheckBox = ref}
      onChange={this.handleChange}
      />
      Type
      </p>
      </form>
    );
  }
});

module.exports = Filter;
