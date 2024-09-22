const { AlowedTo } = require("../../../util/Authorization");
const uplode = require("../../../util/fileuplode");
const {
  add_medicine,
  auth,
  search,
  sale,
  getallmedcstart,
  getallmedc,
  searchforDelete,
  getallmedcselletandsales,
} = require("./medicine.service");

const router = require("express").Router();
router
  .route("/medicine")
  .post(auth, uplode("el"), add_medicine)
  .get(auth, search)
  .put(auth, sale)
  .delete(auth, AlowedTo("admin"), searchforDelete);
router.get("/getallmedcstart/:name", auth, getallmedcstart);
router.get("/getallmedc", auth, getallmedc);
router.get(
  "/getallmedcselletandsales/:name",
  auth,
  AlowedTo("admin"),
  getallmedcselletandsales
);
module.exports = router;
