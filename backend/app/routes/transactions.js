const express = require("express");
const router = express.Router();
const {
  getTransactions,
  addTransaction,
  updateTransaction,
} = require("../controllers/transaction.js");

router.get("/:userId", getTransactions);
router.post("/new", addTransaction);
router.put("/update/:id", updateTransaction);

module.exports = router;
