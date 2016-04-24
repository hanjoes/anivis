var React = require('react');

var DetailsView = React.createClass({
  handleChange() {
    // this.props.inputHandler(this.textInput.value, []);
  },

  render() {
    return (
      <div id="detail">
      <p>Hello!</p>
      {/*type="text"
      placeholder="Search..."
      value={this.props.searchText}
      ref={(ref) => this.textInput = ref}
      onChange={this.handleChange}*/}
      </div>
    );
  }
});

module.exports = DetailsView
