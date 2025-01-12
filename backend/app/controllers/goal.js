const { loadData, saveData } = require("../../../utils/utils.js");

let savingsGoals = loadData("./data/goals.json");

async function createGoal(req, res) {
  const { estimatedExpense, targetAmount, dueDate } = req.body;
  let { userId } = req.params;
  userId = parseInt(userId);
  const [day, month, year] = dueDate.split("-");
  const dueDateObj = new Date(`${year}-${month}-${day}T00:00:00.000Z`);

  const newGoal = {
    id: savingsGoals.length + 1,
    userId: userId,
    estimatedExpense: parseFloat(estimatedExpense),
    targetAmount: parseFloat(targetAmount),
    totalExpenses: 0, // Start with no expenses
    remainingAmount: parseFloat(estimatedExpense),
    dueDateObj,
    createdAt: new Date().toISOString(),
  };

  savingsGoals.push(newGoal);
  saveData("./data/goals.json", savingsGoals);

  res.status(201).json({
    success: true,
    data: [],
    message: "Goal created successfully",
  });
}

async function getGoals(req, res) {
  let { userId } = req.params;
  userId = parseInt(userId);
  const userGoals = savingsGoals.filter((goal) => goal.userId === userId);

  if (userGoals.length === 0) {
    return res.status(404).json({
      success: true,
      data: [],
      message: "No goals found for this user",
    });
  }

  res.status(200).json({
    success: true,
    data: userGoals,
    message: "Goals fetched successfully",
  });
}

async function updateGoal(req, res) {
  let { id } = req.params;
  id = parseInt(id);

  const { estimatedExpense, targetAmount, dueDate } = req.body;
  let { userId } = req.body;
  userId = parseInt(userId);
  const [day, month, year] = dueDate.split("-");
  const dueDateObj = new Date(`${year}-${month}-${day}T00:00:00.000Z`);

  const goalIndex = savingsGoals.findIndex((goal) => goal.id === id);

  if (goalIndex === -1) {
    return res.status(404).json({
      success: true,
      data: [],
      message: "Goal not found",
    });
  }

  savingsGoals[goalIndex].userId = userId;
  savingsGoals[goalIndex].estimatedExpense = parseFloat(estimatedExpense);
  savingsGoals[goalIndex].targetAmount = parseFloat(targetAmount);
  savingsGoals[goalIndex].dueDateObj = dueDateObj;

  //   = {
  //     ...savingsGoals[goalIndex],
  //     userId,
  //     estimatedExpense,
  //     targetAmount,
  //     dueDateObj,
  //   };

  saveData("./data/goals.json", savingsGoals);

  res.status(200).json({
    success: true,
    data: [],
    message: "Savings goal updated successfully",
  });
}

async function increaseExpense(userId, amount) {
  const currentDate = new Date();
  console.log("userId: ", userId, amount);
  const userGoals = savingsGoals.filter(
    (goal) => goal.userId === userId && new Date(goal.dueDateObj) > currentDate
  );
  console.log("goals of user:", userGoals);

  if (userGoals.length === 0) {
    return;
  }

  userGoals.forEach((goal) => {
    const goalIndex = savingsGoals.findIndex((g) => g.id === goal.id);
    console.log("goalindex", goalIndex);
    console.log("saving", savingsGoals[goalIndex]);

    if (goalIndex !== -1) {
      const newTotalExpenses =
        parseFloat(goal.totalExpenses) + parseFloat(amount);
      const newRemainingAmount =
        parseFloat(goal.estimatedExpense) - parseFloat(newTotalExpenses);

      savingsGoals[goalIndex] = {
        ...goal,
        totalExpenses: newTotalExpenses,
        remainingAmount: newRemainingAmount,
      };
    }
  });

  saveData("./data/goals.json", savingsGoals);
  console.log("Expenses increased successfully for all applicable goals yo");
}

module.exports = { createGoal, getGoals, updateGoal, increaseExpense };
