var React = require('react');
// components
var Search = require('./Search.jsx');
var Filter = require('./Filter.jsx');
var TreeView = require('./TreeView.jsx');
var RankingView = require('./RankingView.jsx');
// js modules
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

  handleFilterAction(attribute, selectedCategory) {
    // flip the value
    var oldStats = this.attributes[attribute];
    var newStats = []
    oldStats.forEach(function(stat) {
      if (stat.hasOwnProperty(selectedCategory)) {
        stat[selectedCategory] = true;
      }
      newStats.push(stat);
    });
    this.attributes[attribute] = newStats;
    this.setState({
      attributes: this.attributes,
    });
  },

  componentWillMount() {
    var component = this;
    var filters = Actions.getAttributes(function(data) {
      var filters = data["filters"];
      component.attributes = {};
      filters.forEach(function(attribute) {
        component.attributes[attribute["name"]] = [];
        attribute["attributes"].forEach(function(attributeName) {
          var categoryStat = {};
          categoryStat[attributeName] = false;
          component.attributes[attribute["name"]].push(categoryStat);
        });
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
          categories={this.attributes[key]}
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
