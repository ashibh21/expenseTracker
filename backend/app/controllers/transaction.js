const { loadData, saveData } = require("../../../utils/utils.js");
let transactions = loadData("./data/transactions.json");
let users = loadData("./data/users.json");
const { increaseExpense } = require("./goal.js");

async function getTransactions(req, res) {
  let { userId } = req.params;
  userId = parseInt(userId);
  console.log(`Received userId: ${userId} (type: ${typeof userId})`);

  // Check if the user exists by matching `userId` with `id` in users.json
  const userExists = users.some((user) => user.id === userId);
  console.log(`Does user exist? ${userExists}`);

  if (!userExists) {
    return res.status(404).json({
      success: false,
      data: [],
      message: "User not found",
    });
  }

  const userTransactions = transactions.filter(
    (transaction) => transaction.userId === userId
  );

  if (userTransactions.length === 0) {
    return res.status(404).json({
      success: true,
      data: [],
      message: "No transactions found",
    });
  }
  console.log(userTransactions);
  // Respond with the filtered transactions
  res.status(200).json({
    success: true,
    data: userTransactions,
    message: "transactions fetched successfully",
  });
}

async function addTransaction(req, res) {
  const { amount, category, description } = req.body;
  let { userId } = req.body;
  userId = parseInt(userId);
  const userExists = users.some((user) => user.id == userId);
  if (!userExists) {
    return res.status(404).json({
      success: false,
      data: [],
      message: "User not found",
    });
  }

  const newTransaction = {
    id: transactions.length + 1,
    userId,
    amount: parseFloat(amount),
    date: new Date().toISOString(),
    category,
    description,
  };

  transactions.push(newTransaction);
  saveData("./data/transactions.json", transactions);
  increaseExpense(userId, amount);

  res.status(201).json({
    success: true,
    data: [],
    message: "Transaction added successfully",
  });
}

async function updateTransaction(req, res) {
  const { id } = req.params;
  const { amount, category, description } = req.body;

  const transactionIndex = transactions.findIndex(
    (transaction) => transaction.id == id
  );

  if (transactionIndex === -1) {
    return res.status(404).json({
      success: false,
      data: [],
      message: "Transaction not found",
    });
  }
  let previousAmount = transactions[transactionIndex].amount;

  transactions[transactionIndex].amount =
    parseFloat(amount) || transactions[transactionIndex].amount;
  transactions[transactionIndex].category =
    category || transactions[transactionIndex].category;
  transactions[transactionIndex].description =
    description || transactions[transactionIndex].description;

  const userId = transactions[transactionIndex].userId;
  saveData("./data/transactions.json", transactions);
  increaseExpense(userId, amount - previousAmount);

  res.status(200).json({
    success: true,
    data: [],
    message: "Transaction updated successfully",
  });
}

module.exports = { getTransactions, addTransaction, updateTransaction };
