const bcrypt = require("bcrypt");
const { loadData, saveData } = require("../../../utils/utils.js");
let users = loadData("./data/users.json");

async function registerUser(req, res) {
  const { email, password } = req.body;
  if (users.find((user) => user.email === email)) {
    return res.status(400).send("User already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: users.length + 1,
    email,
    password: hashedPassword,
  };

  users.push(newUser);
  saveData("./data/users.json", users);
  res.status(201).send("User created successfully");
}

async function loginUser(req, res) {
  console.log("loginUser", req.body);
  const { email, password } = req.body;

  const user = users.find((user) => user.email === email);
  if (!user) {
    return res.status(404).send("User not found");
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).send("Invalid password");
  }
  res.json({ message: `Welcome` });
}

module.exports = { registerUser, loginUser };
