const Apperr = require("./APPERR.JS");

module.exports.CatchErr = (fun) => {
  return (req, res, next) => {
    fun(req, res, next).catch((e) => {
      next(new Apperr(e.message, e.status));
    });
  };
};
