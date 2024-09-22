module.exports.options = {
  format: "A3",
  orientation: "portrait",
  border: "10mm",
  header: {
    height: "45mm",
    contents: '<div style="text-align: center;">pharmacy</div>',
  },
  footer: {
    height: "28mm",
    contents: {
      first: "Cover page",
      2: "Second page",
      default:
        '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>',
      last: "Last Page",
    },
  },
};
