var React = require('react');

var DetailsView = React.createClass({
  render() {
    var listItems = [];
    this.props.animes.forEach(function(anime) {
      listItems.push(
        <div key={anime["name"]}>
          <li>{anime["name"]}</li>
          <br></br>
        </div>);
    });

    return (
      <div id="detail">
        <ul>
          {listItems}
        </ul>
      </div>
    );
  }
});

module.exports = DetailsView
