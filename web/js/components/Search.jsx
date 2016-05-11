var React = require('react');

var Search = React.createClass({
  handleChange() {
    var _c = this;
    this.props.inputHandler(this.textInput.value, []);
  },

  render() {
    return (
      <input
      type="text"
      placeholder="Search..."
      value={this.props.searchText}
      ref={(ref) => this.textInput = ref}
      onChange={this.handleChange}
      />
    );
  }
});

module.exports = Search;
