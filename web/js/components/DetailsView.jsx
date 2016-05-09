var d3 = require('d3');
var React = require('react');

var MAX_STR_LEN = 512;
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

  getSimilars(anime) {
    var str = "";
    anime["similar"].forEach(function(name) {
      if (str.length < MAX_STR_LEN) {
        if (str.length == 0) {
          str += name;
        }
        else {
          str += ", " + name;
        }
      }
    });
    return str;
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
      var similars = _c.getSimilars(anime);
      var summary = anime["summary"];
      if (!summary || summary.length == 0) {
        summary = "None";
      }

      var highlightSpan = {
        color: "rgb(" + gray + "," + gray + "," + gray + ")",
        fontFamily: "'Candal', sans-serif",
      };

      var ratingStyle = highlightSpan;
      ratingStyle["paddingLeft"] = "10px";

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
              <div class={"text"}><span>{summary}</span></div>
              <br></br>
              <br></br>
              <div><span>Suggestions:</span></div>
              <br></br>
              <div class={"text"}><span>{similars}</span></div>
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
