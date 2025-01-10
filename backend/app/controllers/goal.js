const { loadData, saveData } = require("../../../utils/utils.js");

let savingsGoals = loadData("./data/goals.json");
let transactions = loadData("./data/transaction.json");

async function createGoal(req, res) {
  const { estimatedExpense, targetAmount, dueDate } = req.body;
  let { userId } = req.params;
  userId = parseInt(userId);
  const dueDateObj = new Date(dueDate);

  const newGoal = {
    id: savingsGoals.length + 1,
    userId: userId,
    estimatedExpense,
    targetAmount,
    totalExpenses: 0, // Start with no expenses
    remainingAmount: estimatedExpense,
    dueDateObj,
    createdAt: new Date().toISOString(),
  };

  savingsGoals.push(newGoal);
  saveData("./data/goals.json", savingsGoals);

  res
    .status(201)
    .json({ message: "Savings goal created successfully", goal: newGoal });
}

async function getGoals(req, res) {
  let { userId } = req.params;
  userId = parseInt(userId);
  const userGoals = savingsGoals.filter((goal) => goal.userId === userId);

  if (userGoals.length === 0) {
    return res.status(404).send("No savings goals found");
  }

  res.status(200).json(userGoals);
}

async function updateGoal(req, res) {
  let { id } = req.params;
  id = parseInt(id);

  const { estimatedExpense, targetAmount, dueDate, userId } = req.body;
  const dueDateObj = new Date(dueDate);

  const goalIndex = savingsGoals.findIndex((goal) => goal.id === id);

  if (goalIndex === -1) {
    return res.status(404).send("Savings goal not found");
  }

  savingsGoals[goalIndex].userId = userId;
  savingsGoals[goalIndex].estimatedExpense = estimatedExpense;
  savingsGoals[goalIndex].targetAmount = targetAmount;
  savingsGoals[goalIndex].dueDateObj = dueDateObj;

  //   = {
  //     ...savingsGoals[goalIndex],
  //     userId,
  //     estimatedExpense,
  //     targetAmount,
  //     dueDateObj,
  //   };

  saveData("./data/goals.json", savingsGoals);

  res.status(200).json({ message: "Savings goal updated successfully" });
}

async function increaseExpense(userId, amount) {
  const goalIndex = savingsGoals.findIndex((goal) => goal.userId === userId);

  if (goalIndex === -1) {
    return;
  }

  const goal = savingsGoals[goalIndex];
  const newTotalExpenses = goal.totalExpenses + amount;
  const newRemainingAmount = goal.estimatedExpense - newTotalExpenses;

  savingsGoals[goalIndex] = {
    ...goal,
    totalExpenses: newTotalExpenses,
    remainingAmount: newRemainingAmount,
  };

  saveData("./data/goals.json", savingsGoals);
  console.log("Expense increased successfully");
}

module.exports = { createGoal, getGoals, updateGoal, increaseExpense };
