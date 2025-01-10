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
    return res.status(404).send("User not found");
  }

  const userTransactions = transactions.filter(
    (transaction) => transaction.userId === userId
  );

  if (userTransactions.length === 0) {
    return res.status(404).send("No transactions found");
  }

  // Respond with the filtered transactions
  res.status(200).json(userTransactions);
}

async function addTransaction(req, res) {
  const { userId, amount, category, description } = req.body;

  const userExists = users.some((user) => user.id == userId);
  if (!userExists) {
    return res.status(404).send("User not found");
  }

  const newTransaction = {
    id: transactions.length + 1,
    userId,
    amount,
    date: new Date().toISOString(),
    category,
    description,
  };

  transactions.push(newTransaction);
  saveData("./data/transactions.json", transactions);
  increaseExpense(userId, amount);

  res.status(201).json({ message: "Transaction added successfully" });
}

async function updateTransaction(req, res) {
  const { id } = req.params;
  const { userId, amount, category, description } = req.body;

  const transactionIndex = transactions.findIndex(
    (transaction) => transaction.id == id
  );

  if (transactionIndex === -1) {
    return res.status(404).send("Transaction not found");
  }
  let previousAmount = transactions[transactionIndex].amount;

  transactions[transactionIndex] = {
    id,
    userId,
    amount,
    category,
    description,
  };

  saveData("./data/transactions.json", transactions);
  increaseExpense(userId, amount - previousAmount);

  res.status(200).json({ message: "Transaction updated successfully" });
}

module.exports = { getTransactions, addTransaction, updateTransaction };
