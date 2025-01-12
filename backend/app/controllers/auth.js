const bcrypt = require("bcrypt");
const { loadData, saveData } = require("../../../utils/utils.js");
let users = loadData("./data/users.json");

async function registerUser(req, res) {
  const { email, password } = req.body;
  if (users.find((user) => user.email === email)) {
    return res.status(400).json({
      success: false,
      message: "User already exist",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: users.length + 1,
    email,
    password: hashedPassword,
  };

  users.push(newUser);
  saveData("./data/users.json", users);
  res.status(201).json({
    success: true,
    message: "User created successfully",
    userId: newUser.id,
  });
}

async function loginUser(req, res) {
  console.log("loginUser", req.body);
  const { email, password } = req.body;

  const user = users.find((user) => user.email === email);
  if (!user) {
    return res.status(404).json({
      success: false, // Add success field for consistency
      message: "User not found",
    });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({
      success: false, // Add success field for consistency
      message: "Invalid password",
    });
  }

  res.status(200).json({
    success: true, // Add success field for consistency
    message: "Welcome",
    userId: user.id,
  });
}

module.exports = { registerUser, loginUser };
