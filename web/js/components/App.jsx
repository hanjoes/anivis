var d3timer = require('d3-timer');
var React = require('react');
// components
var Search = require('./Search.jsx');
var Filter = require('./Filter.jsx');
var TreeView = require('./TreeView.jsx');
var DetailsView = require('./DetailsView.jsx');
var RankingView = require('./RankingView.jsx');
// js modules
var Actions = require('../actions/Actions');

var App = React.createClass({
  getInitialState() {
    var _c = this;
    _c.searchText = "";
    _c.filters = [];
    _c.categories = {};
    _c.animes = [];
    _c.treeTimer = d3timer.timer(function() {});
    _c.root = {};
    _c.ranks = {};
    return _c.states();
  },

  states() {
    var _c = this;
    return {
      searchText: _c.searchText,
      filters: _c.filters,
      categories: _c.categories,
      animes: _c.animes,
      treeTimer: _c.treeTimer,
      root: _c.root,
      ranks: _c.ranks
    };
  },

  getRankingViewState() {
    var _c = this;
    return _c.rankingViewState ? _c.rankingViewState : {};
  },

  handleUserInput(searchText, attributes) {
    var _c = this;
    _c.setState({
      searchText: searchText
    });
  },

  handleMouseHover(animeList) {
    var _c = this;
    Actions.getAnimeDetails(animeList, function(data) {
      var input = [];
      animeList.forEach(function(name) {
        if (data[name]) {
          var anime = data[name];
          anime["name"] = name;
          input.push(anime);
        }
      });
      _c.setState({
        animes: input
      });
    });
  },

  handleFilterAction(filterModified, selectedOption) {
    var _c = this;
    var modifiedFilterName = filterModified["name"];

    // ensure we update selected filters with the selected option,
    // this will be used to construct the URL to the data file.
    for (var i = 0; i < _c.selectedFilters.length; ++i) {
      if (_c.selectedFilters[i]["name"] === modifiedFilterName) {
        _c.selectedFilters[i]["selected"] = selectedOption;
      }
    }

    // two things should happen when updating the filters:
    // 1. we should update other filters if it is the first filter value
    // that is changed.
    // 2. if we are selecting options that are not from the first filter,
    // we need to update data for the TreeView *if* we can form a valid path.

    // updating other filters, only when we are modifying the first filter
    if (modifiedFilterName === "Types") {
      Actions.getCategoriesForType(selectedOption, function(data, filterName) {
        var categories = []
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            categories.push(key);
          }
        }
        _c.categories[filterName] = categories;
        _c.setState({
          categories: _c.categories
        });
      });
    }

    ////////////////////// updating force-layout using filters
    Actions.getFilteredData(_c.selectedFilters, function(data) {
      _c.setState({
        root: data
      });
    });

    ////////////////////// updating rankings using filters
    Actions.getRankedAnimes(_c.selectedFilters, function(data) {
      _c.setState({
        ranks: data
      });
    });
  },

  componentWillMount() {
    var _c = this;

    ////////////////////// initialize filters
    var filterAttrs = Actions.getInitialFilterStates(function(data) {
      // initialize App fields
      _c.categories = {};
      _c.selectedFilters = data["filters"];

      var filterConfigs = data["filters"];
      var filters = []

      filterConfigs.forEach(function(filterConfig) {
        filters.push(filterConfig);
      });
      _c.setState({
        filters: filters
      });

      _c.handleFilterAction(filters[0], filters[0]["selected"]);
    });
  },

  render() {
    var _c = this;
    var filters = [];
    _c.state.filters.forEach(function(filter) {
      filters.push(<Filter
        filter={filter}
        categories={_c.categories[filter["name"]]}
        inputHandler={_c.handleFilterAction}
        key={"filter_" + filter["name"]}
        />
      );
    });

    return (
      <div>
      <h1>ANIVIS</h1>
      <hr></hr>
      <form>
      {/*<Search
        searchText={this.state.searchText}
        inputHandler={this.handleUserInput}
        />*/}
        {filters}
        </form>

        <TreeView root={this.state.root} timer={this.state.treeTimer}/>
        <RankingView hoverHandler={this.handleMouseHover} ranks={this.state.ranks}/>
        <DetailsView animes={this.state.animes}/>
        </div>
      );
    }
  });

module.exports = App;
