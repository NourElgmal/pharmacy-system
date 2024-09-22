const AppErr = require("../../../util/APPERR.JS");
const { CatchErr } = require("../../../util/CatchErr");
const {
  verify_email,
  changetrusted,
  changesure,
} = require("../../../util/Verify_email");
const { user_model } = require("./user.module");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Auth } = require("../../../util/Authorization");
module.exports.add_user = CatchErr(async (req, res, next) => {
  const { name, email, pass } = req.body;
  if (!name || !email || !pass) {
    return next(new AppErr("input is required", 400));
  }
  let u = await user_model.findOne({ email: email });
  if (u) {
    return next(new AppErr("email is already exait", 500));
  }
  bcrypt.hash(req.body.pass, 5, async (err, hash) => {
    if (err) {
      return next(new AppErr(err.message, 500));
    } else {
      req.body.pass = hash;
      await user_model.insertMany(req.body);
    }
  });
  let token = jwt.sign(
    {
      user_email: email,
    },
    process.env.JWT_KYE
  );
  verify_email(email, token, process.env.URLLINK); ////email//////////////////////////////////////////////////
  res.status(201).json({ msg: "check your email " });
});
module.exports.change_trusted = changetrusted;
module.exports.login = CatchErr(async (req, res, next) => {
  const { email, pass, The_narrow_branch } = req.body;
  if (!email || !pass || !The_narrow_branch) {
    next(new AppErr("email && password && The narrow branch is req ", 400));
  }
  const user = await user_model.findOne({ email: email });
  if (user) {
    if (!user.trusted) {
      return next(
        new AppErr("email is not verify check your email and try agin", 500)
      );
    }
  } else {
    return next(new AppErr("email is not found please sin up", 500));
  }
  const match = await bcrypt.compare(pass, user.pass);
  if (match) {
    // if (user.jop_title === "factor") {
    user.working_hours = new Date();
    await user.save();
    //} //////
    let token = jwt.sign(
      {
        user_id: user._id,
        user_email: user.email,
        user_name: user.name,
        jop_title: user.jop_title,
        The_narrow_branch: The_narrow_branch,
      },
      process.env.JWT_KYE
    );
    res.status(200).json({ msg: "log in secc", Token: token });
  } else {
    return next(new AppErr("error in email or password ", 500));
  }
});
module.exports.auth = Auth;
exports.show = CatchErr(async (req, res) => {
  const c = await user_model.find({});
  res.json({ msg: c });
});
module.exports.change_password = CatchErr(async (req, res, next) => {
  const { pass } = req.body;
  if (!pass) {
    return next(new AppErr("error password is req", 500));
  }
  const user = await user_model.findById(req.id);
  if (!user) {
    return next(new AppErr("error please login agin", 500));
  }
  if (user.sure) {
    bcrypt.hash(req.body.pass, 5, async (err, hash) => {
      if (err) {
        return next(new AppErr(err.message, 500));
      } else {
        req.body.pass = hash;
        await user_model.findOneAndUpdate(
          { _id: req.id },
          { pass: req.body.pass, change_pass: Date.now() },
          { new: true }
        );
      }
    });
    await user_model.findOneAndUpdate(
      { _id: req.id },
      { $set: { sure: false } },
      { new: true }
    );
  } else {
    let token = jwt.sign(
      {
        user_email: user.email,
      },
      process.env.JWT_KYE
    );
    verify_email(user.email, token, process.env.URLLINKSURE); /////////////////////////////////////
    return next(new AppErr("check your email and try change", 500));
  }

  res.status(200).json({ msg: "change secc" });
});

module.exports.chsure = changesure;
module.exports.delet_user = CatchErr(async (req, res, next) => {
  await user_model.findByIdAndDelete(req.id);
  res.status(200).json({ msg: "delet secc" });
});
module.exports.logout = CatchErr(async (req, res, next) => {
  if (!req.id) {
    return next(new AppErr("req.id is not found", 500));
  }

  const user = await user_model.findById(req.id);
  if (!user) {
    return next(new AppErr("User not found", 404));
  }

  user.change_pass = new Date();

  const now = Date.now();
  const workingHours = user.working_hours
    ? new Date(user.working_hours).getTime()
    : next(new AppErr("not found working_hours", 500));
  const elapsedMilliseconds = now - workingHours;
  const elapsedHours = Math.round(elapsedMilliseconds / (1000 * 60 * 60));

  user.hours.push(elapsedHours);
  user.working_hours = now;

  await user.save();

  res.status(200).json({ msg: "Logout successful", elapsedHours });
});
module.exports.forget_pass = CatchErr(async (req, res, next) => {
  const { email } = req.body;
  const user = await user_model.findOne({ email: email });
  if (!user) {
    return next(new AppErr("email is not found", 500));
  }
  if (user.sure) {
    bcrypt.hash(req.body.pass, 5, async (err, hash) => {
      if (err) {
        return next(new AppErr(err.message, 500));
      }
      //req.body.pass = hash;
      user.pass = hash;
      user.change_pass = new Date();
      await user.save();
    });
    await user_model.findOneAndUpdate(
      { email: email },
      { $set: { sure: false } },
      { new: true }
    );
    res.status(200).json({ msg: "change pass secc please login agin" });
  }
  let token = jwt.sign(
    {
      user_email: email,
    },
    process.env.JWT_KYE
  );
  verify_email(email, token, process.env.URLLINKSURE);
  return next(new AppErr("check your email and try change", 500));
});
