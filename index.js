process.on("uncaughtException", (err) => {
  console.log("err in write code", err);
});
const express = require("express");
require("dotenv").config({ path: "./config/.env" });
const connect = require("./database/connect");
const app = express();
const cors = require("cors");
const { golbalmiddlware } = require("./util/golobalhandelerr");
const port = process.env.PORT || 3000;
connect();
app.use(express.json());
app.use(cors());
app.use(express.static("doc"));
app.use(require("./components/src/user/user.api"));
app.use(require("./components/src/invoice/invo.api"));
app.use(require("./components/src/medicine/medicine.api"));
app.use(require("./components/src/Profit/profit.api"));
app.use(require("./components/src/sales/sales.api"));
app.get("/", (req, res) => res.send("Hello World!"));
app.all("*", (req, res) => {
  res.send("not found this link status 500");
});
app.use(golbalmiddlware);
process.on("unhandledRejection", (err) => {
  console.log("err not handel", err);
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
