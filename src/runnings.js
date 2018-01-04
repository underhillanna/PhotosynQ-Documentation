var headerTitle = require("../dist/title.json").title;

exports.header = {
  height: "1cm",
  contents: function(pageNum, numPages) {
    if (pageNum == 1) {
      return "";
    }
    return "<div class='pageCount' style='position:absolute;top:0;width:100%;text-align:center;font-size:0.6rem;font-family:\"Open Sans\", Helvetica, Arial, sans-serif;color:#999;'>" +
      "PhotosynQ | " +
      headerTitle +
      "</div>";
  }
};

exports.footer = {
  height: "1cm",
  contents: function(pageNum, numPages) {
    return "<div class='pageCount' style='position:absolute;bottom:0;width:100%;text-align:center;font-size:0.6rem;font-family:\"Open Sans\", Helvetica, Arial, sans-serif;'>" +
        "<span class='pageNum'>" + pageNum + "</span>" +
        "<span class='sep'> of </span>" +
        "<span class='numPages'>" + numPages + "</span>" +
      "</div>";
  }
};