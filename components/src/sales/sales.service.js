const { sales_model } = require("./selas.module");
const AppErr = require("../../../util/APPERR.JS");
const { CatchErr } = require("../../../util/CatchErr");
const { Auth } = require("../../../util/Authorization");
const { user_model } = require("../user/user.module");

module.exports.salemodel = async (
  quantity,
  todayDateStr,
  price,
  id,
  branch,
  name
) => {
  try {
    const medc = await sales_model.find();
    if (medc && medc.length) {
      const { sales = [], Seller = [] } = medc[0];
      const saleIndex = sales.findIndex((e) => {
        return (
          e.price === price &&
          e.date.toISOString().split("T")[0] === todayDateStr &&
          e.The_narrow_branch === branch &&
          e.name === name
        );
      });

      if (saleIndex >= 0) {
        sales[saleIndex].quantity += quantity;
        sales[saleIndex].price_for_allquantity =
          sales[saleIndex].quantity * price;
      } else {
        sales.push({
          date: todayDateStr,
          quantity,
          price,
          price_for_allquantity: quantity * price,
          The_narrow_branch: branch,
          name,
        });
      }

      const sellerIndex = Seller.findIndex((seller) =>
        seller.findIndex((entry) => entry.id === id)
      );
      console.log(sellerIndex);
      if (sellerIndex === 0 || sellerIndex > 0) {
        Seller[sellerIndex].push({
          date: new Date(),
          id,
          quantity,
          price,
          name_of_medcen: name,
        });
      } else {
        Seller.push([
          {
            date: new Date(),
            id,
            quantity,
            price,
            name_of_medcen: name,
          },
        ]);
      }

      medc[0].sales = sales;
      medc[0].Seller = Seller;
      await medc[0].save();
    } else {
      const newRecord = await sales_model.insertMany({
        Seller: [
          [
            {
              date: new Date(),
              id,
              quantity,
              price,
              name_of_medcen: name,
            },
          ],
        ],
        sales: [
          {
            date: todayDateStr,
            quantity,
            price,
            price_for_allquantity: quantity * price,
            The_narrow_branch: branch,
            name,
          },
        ],
      });
    }
  } catch (e) {
    console.error("Error in sale model:", e.message);
    return new AppErr(e.message, 500);
  }
};

module.exports.salesinformtionall = CatchErr(async (req, res, next) => {
  const sal = await sales_model.find();
  if (sal && sal.length) {
    res.json({
      sales: sal[0].sales,
    });
  } else {
    res.status(404).json({ message: "No sales data found." });
  }
});
module.exports.sellerinformtionall = CatchErr(async (req, res, next) => {
  const Seller = await sales_model.find();
  if (Seller && Seller.length) {
    res.json({
      Seller: Seller[0].Seller,
    });
  } else {
    res.status(404).json({ message: "No sales data found." });
  }
});
module.exports.getseles_in_date = CatchErr(async (req, res, next) => {
  const { d } = req.params;
  const medc = await sales_model.find();
  let { sales = [] } = medc[0];
  let arr = [];
  for (let index of sales) {
    if (
      index.date.toISOString().split("T")[0] ===
      new Date(d).toISOString().split("T")[0]
    ) {
      arr.push(index);
    }
  }
  if (arr && arr.length) {
    res.status(200).json({ message: arr });
  } else {
    res.status(404).json({ message: "No sales data found." });
  }
});
module.exports.sellerinformtion = CatchErr(async (req, res, next) => {
  const { email } = req.params;
  const { _id } = await user_model.find({ email });
  const medc = await sales_model.find().populate("Seller.id", "name email");
  let { Seller = [] } = medc[0];
  if (Seller && Seller.length) {
    let index = Seller.findIndex((e) =>
      e.findIndex((c) => {
        return c.id._id === _id;
      })
    );
    console.log(index);
    res.status(200).json({ message: Seller[index] });
  } else {
    res.status(404).json({ message: "No Seller  found." });
  }
});
module.exports.deletsellerinformtionall = CatchErr(async (req, res, next) => {
  const medc = await sales_model.find();
  medc[0].Seller = [];
  await medc[0].save();
  res.status(200).json({ message: "delet secc" });
});
module.exports.deletsellerinformtion = CatchErr(async (req, res, next) => {
  const { email } = req.params;
  const { _id } = await user_model.find({ email });
  const medc = await sales_model.find().populate("Seller.id", "name email");
  let { Seller = [] } = medc[0];
  if (Seller && Seller.length) {
    let index = Seller.findIndex((e) =>
      e.findIndex((c) => {
        return c.id._id === _id;
      })
    );
    medc[0].Seller.splice(index, 1);
    await medc[0].save();
    res.status(200).json({ message: "delet secc " + email });
  } else {
    res.status(404).json({ message: "No Seller  found." });
  }
});
module.exports.delete_salesinformtionall = CatchErr(async (req, res, next) => {
  const sal = await sales_model.find();
  if (sal && sal.length) {
    sal[0].sales = [];
    await sal[0].save();

    res.status(200).json({ message: "delet sales secc " });
  } else {
    res.status(404).json({ message: "No sales found." });
  }
});
module.exports.delete_seles_in_date = CatchErr(async (req, res, next) => {
  const { d } = req.params;
  const medc = await sales_model.find();
  let { sales = [] } = medc[0];
  let i = 0;
  for (let index = 0; index < sales.length; index++) {
    if (
      sales[index].date.toISOString().split("T")[0] ===
      new Date(d).toISOString().split("T")[0]
    ) {
      medc[0].sales.splice(index, 1);
      i += 1;
    }
  }
  medc[0].save();
  if (i) {
    res.status(200).json({ message: "delet secc " + d });
  } else {
    res.status(404).json({ message: "No sales  found in this date" });
  }
});
module.exports.delete_alldate = CatchErr(async (req, res, next) => {
  await sales_model.deleteMany({});
  res.status(200).json({ message: "delet  secc " });
});
module.exports.auth = Auth;
