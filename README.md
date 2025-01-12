# Expense Tracker 

## Overview

The Expense Tracker is a command-line interface application designed to help users manage their financial transactions, set savings goals, and generate detailed reports. It interacts with a backend server for data persistence and supports features such as user authentication, transaction management, goal tracking, and report generation.

## Features

1. **User Authentication**:

   - Register and login functionality.
   - Passwords are securely hashed using bcrypt.

2. **Transaction Management**:

   - Add and view transactions.
   - Update transaction details.

3. **Goal Tracking**:

   - Set savings goals with estimated expenses, target amounts, and due dates.
   - View and update existing goals.

4. **Report Generation**:

   - Generate monthly or yearly financial reports.
   - Reports include total income, total expenses, savings, and category-wise spending.

---

## Design Overview
## Backend
The backend is built using Node.js and Express. It provides RESTful APIs for:

- User authentication (register and login).
- Managing transactions and savings goals.
- Generating reports.
- Data Storage
- The data is stored in JSON files (users.json, transactions.json, savingsGoals.json), making it simple and lightweight.
- Authentication
- Passwords are hashed using bcrypt for security.
- The user ID is used to identify and manage user-specific data.
## CLI
The CLI is built using Node.js with the inquirer library for user interaction and axios for API calls.

- Main Menu: Provides options to view/add transactions, view/add goals, and generate reports.
- Error Handling: Ensures smooth user experience by validating inputs and providing meaningful error messages.
## Assumptions
- Data Storage: The application uses in-memory JSON files for simplicity. This is not ideal for production environments and should be replaced with a database like MongoDB or PostgreSQL.
- Authentication: No session management or token-based authentication is implemented; the application trusts user IDs passed from the CLI.
- Single User Interface: The application assumes one user session per CLI instance.
- Error Handling: Limited validation for inputs; assumes that inputs are mostly valid.
- Currency: No specific currency format is enforced.
- Report Accuracy: The income provided in the report generation is treated as the sole source of income.
## Future Enhancements
- Database Integration: Replace JSON files with a database for scalability.
- Authentication Tokens: Use JWT for secure session management.
- Validation: Add more robust input validation for transactions, goals, and report parameters.
- Cross-Platform Support: Expand to include a web-based or mobile interface.
- Data Export: Enable exporting reports to formats like CSV or PDF.




## TEST CASES 
- https://docs.google.com/document/d/1lcvXTKyiNFDNsv2ADrXGFxNaJDl_xKMu2B5ubZ4op-M/edit?usp=sharing
## API contracts
- https://www.postman.com/flight-cosmologist-82913118/workspace/expense-tracker/collection/34588375-b17af461-d88c-4b74-961e-755fc68d85d7?action=share&creator=34588375 
## Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org) (v16 or later)
- npm (Node Package Manager)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository_url>
   cd expenseTracker
2. Navigate to the backend server and install dependency:
   ```bash
   
   cd backend
   npm i
   node index.js
3. Navigate to the client folder and install dependency and run:
  ```bash

    cd client
    npm I
    node cli.js






