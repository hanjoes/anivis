var React = require('react');
var Search = require('./Search.jsx');
var Filter = require('./Filter.jsx');
var Actions = require('../actions/Actions');

var App = React.createClass({
  getInitialState() {
    return {
      searchText: "",
      attributes: []
    }
  },

  handleUserInput(searchText, attributes) {
    this.setState({
      searchText: searchText,
    });
  },

  // flip the status of the attribute
  handleFilterAction(attribute) {
    this.setState({
      searchText: searchText,
    });
  },

  componentWillMount() {
    var component = this;
    var filters = Actions.getAttributes(function(data) {
      var filters = data["filters"];
      this.attributes = {}
      filters.forEach(function(attribute) {
        attributes[attribute] = false;
      });
      component.setState({ attributes: attributes });
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
      inputHandler={this.handleFilterAction}
      />
      </div>
    );
  }
});

module.exports = App;
