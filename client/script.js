const backendUrl = "http://localhost:3000"; // Replace with your backend URL

// Handle login and register logic
if (document.getElementById("loginForm")) {
  // Login form submission
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const response = await fetch(`${backendUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("userId", result.userId); // Save userId to localStorage
        window.location.href = "transactions.html"; // Redirect to transactions page
      } else {
        alert(result.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during login.");
    }
  });

  // Register form submission
  document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    try {
      const response = await fetch(`${backendUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Registration successful! Please log in.");
      } else {
        alert(result.message || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during registration.");
    }
  });
}


if (document.getElementById("transactionsTable")) {
  const userId = localStorage.getItem("userId");

  // Check if userId exists in localStorage
  if (!userId) {
    alert("User not logged in. Redirecting to login page.");
    window.location.href = "index.html"; // Redirect to login page if userId is missing
  }

  // Fetch and display transactions
  async function fetchTransactions() {
    try {
      const response = await fetch(`${backendUrl}/transactions/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const transactions = await response.json();

      const tbody = document.querySelector("#transactionsTable tbody");
      tbody.innerHTML = ""; // Clear existing rows

      transactions.forEach((trans) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${trans.id}</td>
          <td><input type="number" value="${trans.amount}" id="amount-${trans.id}" /></td>
          <td><input type="text" value="${trans.category}" id="category-${trans.id}" /></td>
          <td><input type="text" value="${trans.description}" id="description-${trans.id}" /></td>
          <td>
            <button class="update" onclick="updateTransaction(${trans.id})">Update</button>
          </td>
        `;
        tbody.appendChild(row);
      });
    } catch (error) {
      console.error(error);
      alert("Error fetching transactions");
    }
  }

  // Update a transaction
  window.updateTransaction = async (id) => {
    try {
      const amount = document.getElementById(`amount-${id}`).value;
      const category = document.getElementById(`category-${id}`).value;
      const description = document.getElementById(`description-${id}`).value;

      const response = await fetch(`${backendUrl}/transactions/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, category, description }),
      });

      if (response.ok) {
        fetchTransactions(); // Refresh the transactions
      } else {
        throw new Error("Failed to update transaction");
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // Add a new transaction
  document.getElementById("addTransactionForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const amount = document.getElementById("newAmount").value;
    const category = document.getElementById("newCategory").value;
    const description = document.getElementById("newDescription").value;

    try {
      const response = await fetch(`${backendUrl}/transactions/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, amount, category, description }),
      });

      if (response.ok) {
        document.getElementById("addTransactionForm").reset(); // Clear the form
        fetchTransactions(); // Refresh the transactions list
      } else {
        throw new Error("Failed to add transaction");
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  });

  // Fetch transactions on page load
  fetchTransactions();
}
