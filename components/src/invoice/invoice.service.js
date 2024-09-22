const { invoice_model } = require("./invoice.module");
var pdf = require("pdf-creator-node");
var fs = require("fs");
var path = require("path");
const { CatchErr } = require("../../../util/CatchErr");
const { options } = require("./op");
const { Auth } = require("../../../util/Authorization");
module.exports.addinvoice = CatchErr(async (req, res, next) => {
  const invoice = invoice_model(req.body);
  await invoice.save();
  next();
});
module.exports.creatpdf = CatchErr(async (req, res, next) => {
  let inv;
  const id = req.header("id");
  if (id) {
    inv = await invoice_model.findById(id).lean();
    inv = [inv];
    console.log(inv);
  } else {
    inv = await invoice_model.find().lean();
    if (!req.header("printall")) {
      inv = [inv[inv.length - 1]];
      lan = 1;
    } else {
      var lan = inv.length;
    }
  }

  for (let index = 0; index < lan; index++) {
    inv[index].Products.forEach((product) => {
      product.total = product.price * product.quantity;
    });
  }

  var html = fs.readFileSync(path.join(__dirname, "./invoice.html"), "utf8");
  let filname = "invoice.pdf";
  var document = {
    html: html,
    data: { inv },
    path: process.env.PATHPDF + filname,
  };

  pdf
    .create(document, options)
    .then((r) => {
      console.log(r);
      res.json({
        msg: "invlo",
        download: `${process.env.URL}invoice.pdf`,
      });
    })
    .catch((error) => {
      console.error(error);
      res.json({ err: error });
    });
});
module.exports.get_invoice = CatchErr(async (req, res, next) => {
  const invoice = await invoice_model.find();
  if (invoice) {
    res.status(200).json({ invoice: invoice });
  } else {
    res.status(404).json({ invoice: "not found " });
  }
});
module.exports.auth = Auth;
