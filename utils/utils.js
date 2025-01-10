const fs = require("fs");

const loadData = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Save data to file
const saveData = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

module.exports = { loadData, saveData };
