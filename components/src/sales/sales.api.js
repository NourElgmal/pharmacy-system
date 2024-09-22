const { AlowedTo } = require("../../../util/Authorization");
const {
  auth,
  salesinformtionall,
  sellerinformtionall,
  getseles_in_date,
  sellerinformtion,
  deletsellerinformtionall,
  deletsellerinformtion,
  delete_seles_in_date,
  delete_salesinformtionall,
  delete_alldate,
} = require("./sales.service");

const express = require("express").Router();
express.use(auth, AlowedTo("admin"));
express.delete("/deletall", delete_alldate);
express
  .route("/sales")
  .get(salesinformtionall)
  .delete(delete_salesinformtionall);
express
  .route("/seller")
  .get(sellerinformtionall)
  .delete(deletsellerinformtionall);
express.route("/sales/:d").get(getseles_in_date).delete(delete_seles_in_date);
express
  .route("/seller/:email")
  .get(sellerinformtion)
  .delete(deletsellerinformtion);

module.exports = express;
