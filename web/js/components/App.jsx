var React = require('react');
var Search = require('./Search.jsx');
var Filter = require('./Filter.jsx');

var App = React.createClass({
  getInitialState() {
    return {
      searchText: "",
      attributes: []
    }
  },

  handleUserInput: function(searchText, attributes) {
    this.setState({
      searchText: searchText,
      attributes: attributes
    });
  },

  render() {



    return (
      <div>
      <Search
      searchText={this.state.searchText}
      inputHandler={this.handleUserInput}
      />
      <Filter
      attributes={this.state.attributes}
      inputHandler={this.handleUserInput}
      />
      </div>
    );
  }
});

module.exports = App;
