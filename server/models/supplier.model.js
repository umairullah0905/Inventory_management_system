const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String
});


module.exports = mongoose.model("Supplier", supplierSchema);

