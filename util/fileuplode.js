const multer = require("multer");
const uplode = (filepath) => {
  const storage = multer.diskStorage({});
  const upload = multer({ storage: storage });
  return upload.single(filepath);
};
module.exports = uplode;
