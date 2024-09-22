const { user_model } = require("../components/src/user/user.module");
const AppErr = require("./APPERR.JS");
const { CatchErr } = require("./CatchErr");
const jwt = require("jsonwebtoken");
module.exports.Auth = CatchErr(async (req, res, next) => {
  const tok = req.header("token");
  if (!tok) {
    return next(new AppErr("not Authorization err moust add token", 400));
  }
  jwt.verify(tok, process.env.JWT_KYE, async function (err, decoded) {
    if (err) {
      return next(new AppErr("not Authorization", 500));
    }
    const user = await user_model.findById(decoded.user_id);
    if (!user) {
      return next(new AppErr("not found email user delete or chenage", 500));
    }
    if (user.change_pass) {
      var token_time = user.change_pass.getTime() / 1000;
    }
    if (token_time > decoded.iat) {
      return next(
        new AppErr("Token is no longer valid. Please login again.", 401)
      );
    }
    req.id = decoded.user_id;
    if (decoded.The_narrow_branch) {
      req.branch = decoded.The_narrow_branch;
    }
    next();
  });
});
module.exports.AlowedTo = (...role) => {
  return CatchErr(async (req, res, next) => {
    const user = await user_model.findById(req.id);
    if (!user) {
      return next(new AppErr("not found email user delete or chenage", 500));
    }
    if (role.includes(user.jop_title)) {
      next();
    } else {
      return next(new AppErr("not auth", 500));
    }
  });
};
