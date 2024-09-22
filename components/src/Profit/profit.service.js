const AppErr = require("../../../util/APPERR.JS");
const { profit_model } = require("./Profit.module");
const { CatchErr } = require("../../../util/CatchErr");
const { Auth } = require("../../../util/Authorization");

module.exports.add_profit = async (DATE, ProfiT) => {
  try {
    let date = DATE;
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    date = date.toISOString().split("T")[0];
    let Profit = ProfiT;

    const profit = await profit_model.find();
    if (profit.length !== 0) {
      const dayindex = profit[0].day.findIndex(
        (e) => e.date.toISOString().split("T")[0] === date
      );
      if (dayindex !== -1) {
        profit[0].day[dayindex].profit += Profit;
      } else {
        profit[0].day.push({
          date,
          profit: Profit,
        });
      }

      const monthindex = profit[0].month.findIndex(
        (e) => e.date.getMonth() + 1 === month
      );
      if (monthindex !== -1) {
        profit[0].month[monthindex].profit += Profit;
        if (profit[0].day.length >= 30) {
          profit[0].day = [];
        }
      } else {
        profit[0].month.push({
          date,
          profit: Profit,
        });
        if (profit[0].day.length >= 30) {
          profit[0].day = [];
        }
      }

      const yearindex = profit[0].year.findIndex(
        (e) => e.date.getFullYear() === year
      );
      if (yearindex !== -1) {
        profit[0].year[yearindex].profit += Profit;
        if (profit[0].month.length >= 12) {
          profit[0].month = [];
        }
      } else {
        profit[0].year.push({
          date,
          profit: Profit,
        });
        if (profit[0].month.length >= 12) {
          profit[0].month = [];
        }
      }

      await profit[0].save();
    } else {
      await profit_model.insertMany({
        day: [
          {
            date,
            profit: Profit,
          },
        ],
        month: [
          {
            date,
            profit: Profit,
          },
        ],
        year: [
          {
            date,
            profit: Profit,
          },
        ],
      });
    }
  } catch (err) {
    return new AppErr(err.massage, 500);
  }
};
module.exports.getprofit = CatchErr(async (req, res, next) => {
  const profit = await profit_model.find();
  if (profit) {
    res.json({
      profit_day: profit[0].day,
      profit_month: profit[0].month,
      profit_year: profit[0].year,
    });
  } else {
    next(new AppErr("not found enay prfit", 400));
  }
});

module.exports.auth = Auth;
