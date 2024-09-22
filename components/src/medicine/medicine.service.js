const XLSX = require("xlsx");
const AppErr = require("../../../util/APPERR.JS");
const { Auth } = require("../../../util/Authorization");
const { CatchErr } = require("../../../util/CatchErr");
const { medicine_model } = require("./medicine.module");
const { add_profit } = require("../Profit/profit.service");
const { salemodel } = require("../sales/sales.service");

module.exports.add_medicine = CatchErr(async (req, res, next) => {
  let data = [{}];
  if (req.file) {
    const readfile = XLSX.readFile(req.file.path);
    const readdata = readfile.Sheets[readfile.SheetNames[0]];
    data = XLSX.utils.sheet_to_json(readdata);
  } else {
    if (req.body && Array.isArray(req.body)) {
      data = req.body;
    } else {
      data = [req.body];
    }
  }
  if (!data) {
    return next(new AppErr("no input ", 400));
  }

  for (let key = 0; key < data.length; key++) {
    if (!data[key] || !data[key].name) {
      return next(new AppErr("Name is required to add medicine", 400));
    }

    const { name, price, quantity, ...otherFields } = data[key];

    if (price == null || quantity == null) {
      return next(new AppErr("Price and quantity are required", 400));
    }

    const todayDateStr = new Date().toISOString().split("T")[0];
    const existingMedicine = await medicine_model.findOne({ name });
    if (!existingMedicine.quantity) {
      existingMedicine.Expiry_date = [];
      existingMedicine.The_narrow_branch = [];
      existingMedicine.price_AND_Date = [];
      existingMedicine.new_price_AND_Date = [];
      existingMedicine.Seller = [];
      existingMedicine.sale = [];
      await existingMedicine.save();
    }
    if (existingMedicine) {
      const priceEntryIndex = existingMedicine.price_AND_Date.findIndex(
        (entry) => entry.date.toISOString().split("T")[0] === todayDateStr
      );

      const newPriceEntryIndex = existingMedicine.new_price_AND_Date.findIndex(
        (entry) => entry.date.toISOString().split("T")[0] === todayDateStr
      );

      if (priceEntryIndex !== -1) {
        if (existingMedicine.price_AND_Date[priceEntryIndex].price === price) {
          existingMedicine.quantity += quantity;
          existingMedicine.price_AND_Date[priceEntryIndex].quantity += quantity;
        } else {
          existingMedicine.price_AND_Date[priceEntryIndex].price = price;
          existingMedicine.quantity += quantity;
          existingMedicine.price_AND_Date[priceEntryIndex].quantity += quantity;
        }
      } else {
        if (existingMedicine.quantity === 0) {
          existingMedicine.price_AND_Date.push({
            date: todayDateStr,
            price,
            quantity,
          });
          existingMedicine.quantity += quantity;
        } else {
          if (newPriceEntryIndex !== -1) {
            if (
              existingMedicine.new_price_AND_Date[newPriceEntryIndex].price !==
              price
            ) {
              existingMedicine.new_price_AND_Date[newPriceEntryIndex].price =
                price;
              existingMedicine.new_price_AND_Date[
                newPriceEntryIndex
              ].quantity += quantity;
            }
          } else {
            existingMedicine.new_price_AND_Date.push({
              date: todayDateStr,
              price,
              quantity,
            });
          }
          existingMedicine.quantity += quantity;
        }
      }

      existingMedicine.Addition_history = new Date();

      if (!Array.isArray(existingMedicine.Expiry_date)) {
        existingMedicine.Expiry_date = [];
      }

      const expiryIndex = existingMedicine.Expiry_date.findIndex((e) => {
        return e.date.toISOString() === data[key].Expiry_date;
      });

      if (expiryIndex > 0 || expiryIndex === 0) {
        if (existingMedicine.Expiry_date[expiryIndex]) {
          existingMedicine.Expiry_date[expiryIndex].quantity =
            (existingMedicine.Expiry_date[expiryIndex].quantity || 0) +
            quantity;
          existingMedicine.Expiry_date[expiryIndex].price_for_allquantity =
            existingMedicine.Expiry_date[expiryIndex].quantity *
            existingMedicine.Expiry_date[expiryIndex].price;
        }
      } else {
        existingMedicine.Expiry_date.push({
          date: data[key].Expiry_date,
          quantity: quantity,
          price: price,
          price_for_allquantity: quantity * price,
        });
      }

      existingMedicine.Company_Name = data[key].Company_Name;

      existingMedicine.discount = data[key].discount;
      existingMedicine.code_medicine = data[key].code_medicine;
      const branchindex = existingMedicine.The_narrow_branch.findIndex(
        (e) => e.The_narrow_branch === req.branch
      );
      if (branchindex > 0 || branchindex === 0) {
        existingMedicine.The_narrow_branch[branchindex].quantity += quantity;
      } else {
        existingMedicine.The_narrow_branch.push({
          quantity: quantity,
          price: price,
          The_narrow_branch: req.branch,
        });
      }
      await existingMedicine.save();
    } else {
      const newMedicine = new medicine_model({
        ...otherFields,
        name,
        price_AND_Date: [{ date: todayDateStr, price, quantity }],
        Expiry_date: [
          {
            date: data[key].Expiry_date,
            quantity: quantity,
            price: price,
            price_for_allquantity: quantity * price,
          },
        ],
        The_narrow_branch: [
          {
            price: price,
            quantity: quantity,
            The_narrow_branch: req.branch,
          },
        ],
        quantity,
      });

      await newMedicine.save();
    }
  }

  return res.json({
    msg: "Medicine added successfully||Medicine updated successfully ",
  });
});
module.exports.search = CatchErr(async (req, res, next) => {
  const { name, code_medicine } = req.headers;
  let medc;
  if (name) {
    medc = await medicine_model.findOne({ name });
    sr(medc);
  } else if (code_medicine) {
    medc = await medicine_model.findOne({ code_medicine });
    sr(medc);
  } else {
    return next(new AppErr("not found to need search it", 400));
  }
  function sr(medc) {
    if (!medc) return next(new AppErr("the Medicine is not found", 400));
    if (!medc.quantity) {
      res.json({
        name: medc.name,
        quantity: medc.quantity,
        price: medc.price_AND_Date,
        new_price: medc.new_price_AND_Date,
      });
    } else {
      res.json({
        name: medc.name,
        quantity: medc.quantity,
        price: medc.price_AND_Date,
        new_price: medc.new_price_AND_Date,
        The_narrow_branch: medc.The_narrow_branch,
        discount: medc.discount,
        Company_Name: medc.Company_Name,
      });
    }
  }
});
module.exports.sale = CatchErr(async (req, res, next) => {
  const { name, code_medicine, quantity, Expiry_date, price } = req.body;
  let medc;

  if (name) {
    medc = await medicine_model.findOne({ name });
  } else if (code_medicine) {
    medc = await medicine_model.findOne({ code_medicine });
  } else {
    return next(new AppErr("not found to need search it", 400));
  }

  if (medc.quantity < quantity)
    return next(new AppErr("The quantity is not enough", 500));

  const nor = medc.The_narrow_branch.findIndex(
    (e) => e.The_narrow_branch === req.branch
  );

  if (!(nor >= 0)) return next(new AppErr("not found in this branch", 500));

  if (medc.The_narrow_branch[nor].The_narrow_branch.quantity < quantity)
    return next(new AppErr("The quantity is not enough", 500));

  let exp = medc.Expiry_date.findIndex((e) => {
    const dbDate = e.date.toISOString().split("T")[0];
    const reqExpiryDate = new Date(Expiry_date).toISOString().split("T")[0];
    return dbDate === reqExpiryDate;
  });

  if (!(exp >= 0))
    return next(new AppErr("err in Expiry_date your input", 500));

  if (medc.Expiry_date[exp].quantity < quantity)
    return next(
      new AppErr(
        "err in Expiry_date your input  the quantity is not enough",
        500
      )
    );

  let pri = medc.price_AND_Date.findIndex((e) => e.price === price);
  let newpri = medc.new_price_AND_Date.findIndex((e) => e.price === price);

  if (!(pri >= 0)) {
    if (!(newpri >= 0)) {
      return next(new AppErr("err in price your input is not found", 400));
    } else {
      if (medc.new_price_AND_Date[newpri].quantity < quantity)
        return next(
          new AppErr("err in price your input the quantity is not enough", 500)
        );
      medc.new_price_AND_Date[newpri].quantity -= quantity;
    }
  } else {
    if (medc.price_AND_Date[pri].quantity < quantity)
      return next(
        new AppErr("err in price your input the quantity is not enough", 500)
      );
    medc.price_AND_Date[pri].quantity -= quantity;
  }

  const todayDateStr = new Date().toISOString().split("T")[0];

  medc.quantity -= quantity;

  medc.The_narrow_branch[nor].quantity -= quantity;

  medc.Expiry_date[exp].quantity -= quantity;
  medc.Expiry_date[exp].price_for_allquantity =
    medc.Expiry_date[exp].quantity * medc.Expiry_date[exp].price;
  const salindx = medc.sales.findIndex(
    (e) =>
      e.price === price &&
      e.date.toISOString().split("T")[0] === todayDateStr &&
      e.The_narrow_branch === req.branch
  );

  if (salindx >= 0) {
    medc.sales[salindx].quantity += quantity;
    medc.sales[salindx].price_for_allquantity =
      medc.sales[salindx].quantity * price;
  } else {
    medc.sales.push({
      date: todayDateStr,
      quantity: quantity,
      price: price,
      price_for_allquantity: quantity * price,
      The_narrow_branch: req.branch,
    });
  }
  const idindex = medc.Seller.findIndex((e) =>
    e.findIndex((c) => c.id === req.id)
  );
  if (idindex >= 0) {
    medc.Seller[idindex].push({
      date: new Date(),
      id: req.id,
      quantity: quantity,
      price: price,
    });
  } else {
    medc.Seller.push([
      {
        date: new Date(),
        id: req.id,
        quantity: quantity,
        price: price,
      },
    ]);
  }

  await medc.save();
  add_profit(new Date(), quantity * price);
  salemodel(quantity, todayDateStr, price, req.id, req.branch, medc.name);

  res.json({
    msg: "sale seccc",
    medc: medc,
  });
});
module.exports.getallmedcstart = CatchErr(async (req, res, next) => {
  const { name } = req.params;
  if (name) {
    const medc = await medicine_model
      .find({
        name: { $regex: `^${name}`, $options: "i" },
      })
      .select("-sales -Seller");
    res.status(200).json({ msg: medc });
  } else {
    next(new AppErr(`the ${name} is not found`, 404));
  }
});
module.exports.getallmedc = CatchErr(async (req, res, next) => {
  const medc = await medicine_model.find({}).select("-sales -Seller");
  res.status(200).json({ msg: medc });
});
module.exports.searchforDelete = CatchErr(async (req, res, next) => {
  const { name, code_medicine } = req.headers;
  let medc;
  if (name) {
    medc = await medicine_model.findOneAndDelete({ name });
  } else if (code_medicine) {
    medc = await medicine_model.findOneAndDelete({ code_medicine });
  } else {
    return next(new AppErr("not found to need search it", 400));
  }
  res.status(200).json({ msg: "delet secc" });
});
module.exports.getallmedcselletandsales = CatchErr(async (req, res, next) => {
  const { name } = req.params;
  if (name) {
    const medc = await medicine_model
      .find({
        name,
      })
      .select("sales Seller");
    res.status(200).json({ msg: medc });
  } else {
    next(new AppErr(`the ${name} is not found`, 404));
  }
});
module.exports.auth = Auth;
