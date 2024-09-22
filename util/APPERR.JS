class AppErr extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.error = "error";
  }
}

module.exports = AppErr;
