const express = require("express");
const router = express.Router();
const { createGoal, getGoals, updateGoal } = require("../controllers/goal.js");

router.get("/:userId", getGoals);
router.post("/new/:userId", createGoal);
router.put("/update/:id", updateGoal);

module.exports = router;
