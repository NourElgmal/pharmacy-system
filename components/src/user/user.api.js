const { AlowedTo } = require("../../../util/Authorization");
const {
  add_user,
  show,
  change_trusted,
  login,
  auth,
  change_password,
  chsure,
  delet_user,
  logout,
  forget_pass,
} = require("./user.service");
const router = require("express").Router();

router
  .route("/user")
  .post(add_user)
  .get(auth, show)
  .patch(auth, change_password)
  .delete(auth, AlowedTo("admin"), delet_user)
  .put(auth, AlowedTo("admin", "user", "factor"), logout);
router.post("/forget_pass", forget_pass);
router.post("/user_login", login);
router.get("/change_sure:token", chsure);
router.get("/change_trusted:token", change_trusted);
module.exports = router;
