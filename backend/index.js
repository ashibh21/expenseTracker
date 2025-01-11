const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./app/routes/authRoutes.js");
const transactionRoutes = require("./app/routes/transactions.js");
const goalRoutes = require("./app/routes/goal.js");
const cors = require("cors");
const app = express();


app.use(cors());
app.use(bodyParser.json());

app.get("/health", (req, res) => {
  res.send("I am healthy");
});
app.use("/auth", authRoutes);
app.use("/transactions", transactionRoutes);
app.use("/goals", goalRoutes);


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
