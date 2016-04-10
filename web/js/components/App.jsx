var React = require('react');
var Search = require('./Search.jsx');
var Filter = require('./Filter.jsx');
var TreeView = require('./TreeView.jsx');
var RankingView = require('./RankingView.jsx');
var Actions = require('../actions/Actions');

var App = React.createClass({
  getInitialState() {
    return {
      searchText: "",
      attributes: {}
    }
  },

  handleUserInput(searchText, attributes) {
    this.setState({
      searchText: searchText,
    });
  },

  handleFilterAction(attribute) {
    this.attributes[attribute] = !this.attributes[attribute];
    this.setState({
      attributes: this.attributes
    });
  },

  componentWillMount() {
    var component = this;
    var filters = Actions.getAttributes(function(data) {
      var filters = data["filters"];
      component.attributes = {};
      filters.forEach(function(attribute) {
        component.attributes[attribute] = false;
      });
      component.setState({ attributes: component.attributes });
    });
  },

  render() {
    var filters = [];
    for (var key in this.attributes) {
      if (this.attributes.hasOwnProperty(key)) {
        filters.push(<Filter
          attribute={key}
          isChecked={this.attributes[key]}
          inputHandler={this.handleFilterAction}
          key={key}
          />
        );
      }
    }
    return (
      <div>
      <h1>ANIVIS</h1>
      <form>
      <Search
      searchText={this.state.searchText}
      inputHandler={this.handleUserInput}
      />
      {filters}
      </form>
      <TreeView />
      <RankingView />
      </div>
    );
  }
});

module.exports = App;
