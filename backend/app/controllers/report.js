const { loadData } = require("../../../utils/utils.js");
let transactions = loadData("./data/transactions.json");

const generateReport = (req, res) => {
  const { month, year, income } = req.body;

  if (!year) {
    return res
      .status(400)
      .json({ success: false, message: "Year is required" });
  }

  // Parse income as a number
  const parsedIncome = income ? parseFloat(income) : 0;

  // Filter transactions for the given year and (optional) month
  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    const isYearMatch = transactionDate.getFullYear() === parseInt(year);
    const isMonthMatch = month
      ? transactionDate.getMonth() + 1 === parseInt(month)
      : true;
    return isYearMatch && isMonthMatch;
  });
  console.log(filteredTransactions);

  // Calculate total expenses (convert amounts to numbers)
  const totalExpenses = filteredTransactions.reduce((sum, transaction) => {
    return sum + parseFloat(transaction.amount);
  }, 0);

  // Calculate savings
  const totalSavings = parsedIncome - totalExpenses;

  const categoryWiseSpending = filteredTransactions.reduce(
    (categories, transaction) => {
      const category = transaction.category || "Uncategorized";
      categories[category] =
        (categories[category] || 0) + parseFloat(transaction.amount);
      return categories;
    },
    {}
  );

  return res.status(200).json({
    success: true,
    data: {
      totalIncome: parsedIncome,
      totalExpenses,
      totalSavings,
      categoryWiseSpending,
      transactions: filteredTransactions,
    },
  });
};
module.exports = { generateReport };
