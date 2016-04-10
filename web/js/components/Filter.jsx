var React = require('react');
var CheckboxItem = require('./CheckboxItem.jsx');

var Filter = React.createClass({
  render() {
    var attributes = this.props.attributes;
    var component = this;
    var filters = [];
    for (var key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        filters.push(
          <CheckboxItem key={key} attribute={key}/>
        );
      }
    }
    return (
      <form>{filters}</form>
    );
  }
});

module.exports = Filter;
