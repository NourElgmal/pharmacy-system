const { AlowedTo } = require("../../../util/Authorization");
const { getprofit, auth } = require("./profit.service");

const express = require("express").Router();
express.route("/profit").get(auth, AlowedTo("admin"), getprofit);
module.exports = express;
