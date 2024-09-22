module.exports.golbalmiddlware = (err, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    divmode(err, res);
  } else {
    productmode(err, res);
  }
};
let divmode = (err, res) => {
  res
    .status(err.status || 500)
    .json({ msg: err.message, satus: err.status, stack: err.stack });
};
let productmode = (err, res) => {
  res.status(err.status || 500).json({ msg: err.message, satus: err.status });
};
