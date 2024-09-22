const mongoose = require("mongoose");
const connect = () => {
  mongoose
    .connect(process.env.URLDB)
    .then(() => {
      console.log("tmam con");
    })
    .catch((e) => {
      console.log(e);
    });
};
module.exports = connect;
