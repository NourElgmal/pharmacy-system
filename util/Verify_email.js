const nodemailer = require("nodemailer");
const { CatchErr } = require("./CatchErr");
const { user_model } = require("../components/src/user/user.module");
const jwt = require("jsonwebtoken");
module.exports.verify_email = async (email, token, URL) => {
  if (!email) {
    throw new Error("Recipient email address is required.");
  }
  console.log(token);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "nouralgmal123@gmail.com",
      pass: "xhzv gwqx dvjb lxay",
    },
  });
  const info = await transporter.sendMail({
    from: '"pharmacy" <nouralgmal123@gmail.com>',
    to: email,
    subject: "Hello ✔",
    text: "Please click on Verify to verify your account on the pharmacy ",
    html: `
  <style>
      body, html {
          height: 100%;
          margin: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f2f2f2;
          font-family: 'Arial', sans-serif;
      }
  
      .verification-box {
          width: 300px;
          padding: 30px;
          background-color: #ffffff;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
          text-align: center;
          border-radius: 10px;
      }
  
      .verification-box h2 {
          font-family: 'Georgia', serif;
          font-size: 24px;
          color: #333333;
          margin-bottom: 20px;
      }
  
      .verify-button {
          display: inline-block;
          padding: 10px 20px;
          font-size: 16px;
          color: #ffffff;
          background-color: #007bff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          text-decoration: none;
      }
  
      .verify-button:hover {
          background-color: #0056b3;
      }
  </style>
  
  <div class="verification-box">
      <h2>To verify your account, click here:</h2>
      <a href=${URL + token} class="verify-button">Verify</a>
  </div>
  `,
  });
  //
  console.log("Message sent: %s", info.messageId);
  //res.status(201).json({ msg: "check  your email" });
};
module.exports.changetrusted = CatchErr(async (req, res) => {
  const { token } = req.params;

  jwt.verify(token, process.env.JWT_KYE, async function (err, decoded) {
    if (err) {
      return next(new AppErr("not Authorization", 500));
    }
    console.log(decoded.user_email);
    const trusted = await user_model.findOneAndUpdate(
      { email: decoded.user_email },
      { $set: { trusted: true } },
      { new: true }
    );

    if (!trusted) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ msg: "Email is now trusted", trusted });
  });
});
module.exports.changesure = CatchErr(async (req, res) => {
  const { token } = req.params;

  jwt.verify(token, process.env.JWT_KYE, async function (err, decoded) {
    if (err) {
      return next(new AppErr("not Authorization", 500));
    }
    console.log(decoded.user_email);
    let sure = await user_model.findOneAndUpdate(
      { email: decoded.user_email },
      { $set: { sure: true } },
      { new: true }
    );

    if (!sure) {
      return res.status(404).json({ msg: "User not found" });
    }
  });
  res.json({ msg: "Email is now sure" });
});
