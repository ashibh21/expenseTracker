const axios = require("axios");
const inquirer = require("inquirer");

const backendUrl = "http://localhost:3000"; 

// User Authentication
async function loginOrRegister() {
  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "Do you want to log in or register?",
      choices: ["Login", "Register", "Exit"],
    },
  ]);

  if (action === "Exit") {
    console.log("Goodbye!");
    process.exit(0);
  }

  const { email, password } = await inquirer.prompt([
    { type: "input", name: "email", message: "Enter your email:" },
    { type: "password", name: "password", message: "Enter your password:" },
  ]);

  try {
    const endpoint = action === "Login" ? "/auth/login" : "/auth/register";
    const response = await axios.post(`${backendUrl}${endpoint}`, {
      email,
      password,
    });

    console.log("Response Data:", response.data); // Debugging log

    if (response.data.success) {
      console.log(response.data.message); // Welcome message
      await mainMenu(response.data.userId); // Proceed to main menu
    } else {
      console.log(response.data.message); // Error message
      return loginOrRegister(); // Retry
    }
  } catch (error) {
    console.error("Error:", error.message);
    return loginOrRegister(); // Retry
  }
}

// Main Menu
async function mainMenu(userId) {
  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "What do you want to do?",
      choices: [
        "View Transactions",
        "Add Transaction",
        "Update Transaction",
        "View Goals",
        "Add Goal",
        "Update Goal",
        "Generate Report",
        "Logout",
      ],
    },
  ]);

  switch (action) {
    case "View Transactions":
      await viewTransactions(userId);
      break;
    case "Add Transaction":
      await addTransaction(userId);
      break;
    case "Update Transaction":
      await updateTransaction(userId);
      break;
    case "View Goals":
      await viewGoals(userId);
      break;
    case "Add Goal":
      await addGoal(userId);
      break;
    case "Update Goal":
      await updateGoal(userId);
      break;
    case "Generate Report":
      await generateReport();
      break;
    case "Logout":
      console.log("Logged out successfully!");
      return loginOrRegister();
  }

  await mainMenu(userId); // Loop back to main menu
}

// View Transactions
async function viewTransactions(userId) {
  try {
    const response = await axios.get(`${backendUrl}/transactions/${userId}`);
    console.table(response.data.data || []);
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
  }
}

// Add Transaction
async function addTransaction(userId) {
  const { amount, category, description } = await inquirer.prompt([
    { type: "input", name: "amount", message: "Enter transaction amount:" },
    { type: "input", name: "category", message: "Enter transaction category:" },
    {
      type: "input",
      name: "description",
      message: "Enter transaction description:",
    },
  ]);

  try {
    const response = await axios.post(`${backendUrl}/transactions/new`, {
      userId,
      amount,
      category,
      description,
    });
    console.log(response.data.message);
  } catch (error) {
    console.error("Error adding transaction:", error.message);
  }
}

async function updateTransaction(userId) {
  const { Id, amount, category, description } = await inquirer.prompt([
    { type: "input", name: "Id", message: "Enter transaction Id:" },
    { type: "input", name: "amount", message: "Enter transaction amount:" },
    { type: "input", name: "category", message: "Enter transaction category:" },
    {
      type: "input",
      name: "description",
      message: "Enter transaction description:",
    },
  ]);

  try {
    const response = await axios.put(
      `${backendUrl}/transactions/update/${Id}`,
      {
        userId,
        amount,
        category,
        description,
      }
    );
    console.log(response.data.message);
  } catch (error) {
    console.error("Error adding transaction:", error.message);
  }
}

// View Goals
async function viewGoals(userId) {
  try {
    const response = await axios.get(`${backendUrl}/goals/${userId}`);
    console.table(response.data.data || []);
  } catch (error) {
    console.error("Error fetching goals:", error.message);
  }
}

// Add Goal
async function addGoal(userId) {
  const { estimatedExpense, targetAmount, dueDate } = await inquirer.prompt([
    {
      type: "input",
      name: "estimatedExpense",
      message: "Enter estimated expense:",
    },
    { type: "input", name: "targetAmount", message: "Enter target amount:" },
    {
      type: "input",
      name: "dueDate",
      message: "Enter due date  (dd-mm-yyyy):",
    },
  ]);

  try {
    const response = await axios.post(`${backendUrl}/goals/new/${userId}`, {
      estimatedExpense,
      targetAmount,
      dueDate,
    });
    console.log(response.data.message);
  } catch (error) {
    console.error("Error adding goal:", error.message);
  }
}

async function updateGoal(userId) {
  const { Id, estimatedExpense, targetAmount, dueDate } = await inquirer.prompt(
    [
      {
        type: "input",
        name: "Id",
        message: "Enter Goal Id:",
      },
      {
        type: "input",
        name: "estimatedExpense",
        message: "Enter estimated expense:",
      },
      { type: "input", name: "targetAmount", message: "Enter target amount:" },
      {
        type: "input",
        name: "dueDate",
        message: "Enter due date (dd-mm-yyyy):",
      },
    ]
  );

  try {
    router.put("/update/:id", updateGoal);

    const response = await axios.put(`${backendUrl}/goals/update/${Id}`, {
      estimatedExpense,
      targetAmount,
      dueDate,
    });
    console.log(response.data.message);
  } catch (error) {
    console.error("Error adding goal:", error.message);
  }
}

// Generate Report
async function generateReport() {
  const { month, year, income } = await inquirer.prompt([
    {
      type: "input",
      name: "month",
      message: "Enter month (1-12):",
      default: null,
    },
    { type: "input", name: "year", message: "Enter year:", required: true },
    {
      type: "input",
      name: "income",
      message: "Enter income (optional):",
      default: null,
    },
  ]);

  try {
    const response = await axios.post(`${backendUrl}/reports`, {
      month: month || null,
      year,
      income: income || null,
    });

    const { totalIncome, totalExpenses, totalSavings, categoryWiseSpending } =
      response.data.data;

    console.log("\n--- Report ---");
    console.log(`Total Income: ${totalIncome}`);
    console.log(`Total Expenses: ${totalExpenses}`);
    console.log(`Total Savings: ${totalSavings}`);
    console.log("\nCategory-Wise Spending:");
    console.table(categoryWiseSpending);
  } catch (error) {
    console.error("Error generating report:", error.message);
  }
}

// Start CLI
(async function startCLI() {
  console.log("Welcome to the Expense Tracker CLI!");
  const userId = await loginOrRegister();
  await mainMenu(userId);
})();
