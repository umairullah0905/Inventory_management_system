const  Supplier = require("../models/supplier.model.js");

 const addSupplier = async (req, res) => {
  const supplier = await Supplier.create(req.body);
  res.status(201).json(supplier);
};

 const getSuppliers = async (req, res) => {
  const suppliers = await Supplier.find();
  res.json(suppliers);
};

 const updateSupplier = async (req, res) => {
  const updated = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

 const deleteSupplier = async (req, res) => {
  await Supplier.findByIdAndDelete(req.params.id);
  res.json({ message: 'Supplier deleted' });
};

module.exports = {
    addSupplier,
    getSuppliers,
    updateSupplier,
    deleteSupplier
};
