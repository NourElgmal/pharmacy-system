const { AlowedTo } = require("../../../util/Authorization");

const {
  creatpdf,
  addinvoice,
  get_invoice,
  auth,
} = require("./invoice.service");

const router = require("express").Router();
router.route("/invoice").get(creatpdf).post(addinvoice, creatpdf);
router.get("/get_invoic", auth, AlowedTo("admin"), get_invoice);
module.exports = router;
