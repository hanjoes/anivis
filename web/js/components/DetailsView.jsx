var d3 = require('d3');
var React = require('react');

var num = 0;

var DetailsView = React.createClass({
  getImages(anime) {
    var subnum = 0;
    var images = [];
    anime["pic"].forEach(function(url) {
      images.push(
        <img src={url} key={"img_" + num + "_" + subnum}></img>
      );
      subnum += 1;
    });
    return images;
  },

  render() {
    var _c = this;
    var grayScale = d3.scale.linear().range([200, 0]).domain([0, 10]);

    var listItems = [];
    this.props.animes.forEach(function(anime) {
      num += 1;

      var imgs = _c.getImages(anime);
      var rating = anime["rating"];
      var gray = grayScale(Math.floor(rating));
      var color = "rgb(" + gray + "," + gray + "," + gray + ");";
      var name = anime["name"];
      var summary = anime["summary"];
      if (!summary || summary.length == 0) {
        summary = "None";
      }

      var ratingStyle = {
        color: "rgb(" + gray + "," + gray + "," + gray + ")",
        fontFamily: "'Candal', sans-serif",
        paddingLeft: "10px"
      };

      var highlightSpan = {
        color: "rgb(" + gray + "," + gray + "," + gray + ")",
        fontFamily: "'Candal', sans-serif",
      };

      listItems.push(
        <div key={"ad_" + num}>
          <br></br>
            <li>
              <div><span style={highlightSpan}>{name}</span><span style={ratingStyle}>{rating}</span></div>
              <br></br>
              {imgs}
              <br></br>
              <br></br>
              <div><span>Summary:</span></div>
              <br></br>
              <div><span class={"text"}>{summary}</span></div>
              <hr></hr>
            </li>
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
