let expenses = [];
let goalAmount = 0;
let expenseChart;

function initializeChart() {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: ['#4CAF50', '#FF6384', '#36A2EB', '#FFCE56'],
                hoverOffset: 30  // Zoom effect on hover
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });
}

window.onload = function() {
    initializeChart();
};

function addExpense() {
    const description = document.getElementById("description").value;
    const date = document.getElementById("date").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const category = document.getElementById("category").value;

    if (!description || !date || isNaN(amount) || !category) {
        alert("Please fill all fields.");
        return;
    }

    const newExpense = { description, date, amount, category };
    expenses.push(newExpense); // Add to the expenses array

    // Add the expense to the table
    const table = document.getElementById("expense-table").getElementsByTagName("tbody")[0];
    const newRow = table.insertRow();

    newRow.insertCell(0).textContent = description;
    newRow.insertCell(1).textContent = date;
    newRow.insertCell(2).textContent = amount.toFixed(2);
    newRow.insertCell(3).textContent = category;

    // Add actions to the Action column
    const actionCell = newRow.insertCell(4);

    // Add edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "edit-button";
    editButton.style.marginRight = "10px";
    editButton.addEventListener("click", () => editExpense(newRow.rowIndex - 1));
    actionCell.appendChild(editButton);

    // Add delete icon
    const deleteIcon = document.createElement("img");
    deleteIcon.src = "trash bin.png";
    deleteIcon.alt = "Delete";
    deleteIcon.style.cursor = "pointer";
    deleteIcon.style.marginBottom = "6px";
    deleteIcon.style.width = "20px";
    deleteIcon.style.height = "20px";
    deleteIcon.style.verticalAlign = "middle";
    deleteIcon.addEventListener("click", () => {
        const rowIndex = newRow.rowIndex - 1; // Adjust for header row
        expenses.splice(rowIndex, 1); // Remove from expenses array
        table.deleteRow(rowIndex); // Delete the row from the table
        updateChart(); // Update chart after deletion
        checkGoal(); // Re-check goal after deletion
        updateTotal(); // Update total after deletion
    });
    actionCell.appendChild(deleteIcon);

    // Reset the form and update chart, goal, and total
    document.getElementById("expense-form").reset();
    updateChart();
    checkGoal();
    updateTotal();
}

function updateExpense(index) {
    const description = document.getElementById("description").value;
    const date = document.getElementById("date").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const category = document.getElementById("category").value;

    if (!description || !date || isNaN(amount) || !category) {
        alert("Please fill all fields.");
        return;
    }

    expenses[index] = { description, date, amount, category };

    const table = document.getElementById("expense-table").getElementsByTagName("tbody")[0];
    const row = table.rows[index];
    row.cells[0].textContent = description;
    row.cells[1].textContent = date;
    row.cells[2].textContent = amount.toFixed(2);
    row.cells[3].textContent = category;

    // Clear and re-add actions in the Action column
    const actionCell = row.cells[4];
    actionCell.innerHTML = "";

    // Re-add edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "edit-button";
    editButton.style.marginRight = "10px";
    editButton.addEventListener("click", () => editExpense(index));
    actionCell.appendChild(editButton);

    // Re-add delete icon
    const deleteIcon = document.createElement("img");
    deleteIcon.src = "trash bin.png";
    deleteIcon.alt = "Delete";
    deleteIcon.style.cursor = "pointer";
    deleteIcon.style.width = "20px";
    deleteIcon.style.height = "20px";
    deleteIcon.style.verticalAlign = "middle";
    deleteIcon.addEventListener("click", () => {
        expenses.splice(index, 1);
        table.deleteRow(index);
        updateChart();
        checkGoal();
        updateTotal();
    });
    actionCell.appendChild(deleteIcon);

    document.getElementById("expense-form").reset();
    const addButton = document.querySelector("#expense-form button[type='reset']");
    addButton.textContent = "Add Expense";
    addButton.onclick = addExpense;

    updateChart();
    checkGoal();
    updateTotal();
}


function editExpense(index) {
    const expense = expenses[index];
    document.getElementById("description").value = expense.description;
    document.getElementById("date").value = expense.date;
    document.getElementById("amount").value = expense.amount;
    document.getElementById("category").value = expense.category;

    const addButton = document.querySelector("#expense-form button[type='reset']");
    addButton.textContent = "Update Expense";
    addButton.onclick = function() {
        updateExpense(index);
    };
}

function updateExpense(index) {
    const description = document.getElementById("description").value;
    const date = document.getElementById("date").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const category = document.getElementById("category").value;

    if (!description || !date || isNaN(amount) || !category) {
        alert("Please fill all fields.");
        return;
    }

    // Update the expense data in the array
    expenses[index] = { description, date, amount, category };

    const table = document.getElementById("expense-table").getElementsByTagName("tbody")[0];
    const row = table.rows[index];

    // Update the row's data in the respective cells
    row.cells[0].textContent = description;
    row.cells[1].textContent = date;
    row.cells[2].textContent = amount.toFixed(2);
    row.cells[3].textContent = category; // Ensure the category column stays clean

    // Clear and re-add actions in the Action column
    const actionCell = row.cells[4];
    actionCell.innerHTML = ""; // Clear the Action column

    // Re-add edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "edit-button";
    editButton.style.marginRight = "10px";
    editButton.addEventListener("click", () => editExpense(index));
    actionCell.appendChild(editButton);

    // Re-add delete icon
    const deleteIcon = document.createElement("img");
    deleteIcon.src = "trash bin.png";
    deleteIcon.alt = "Delete";
    deleteIcon.style.cursor = "pointer";
    deleteIcon.style.width = "20px";
    deleteIcon.style.height = "20px";
    deleteIcon.style.verticalAlign = "middle";
    deleteIcon.addEventListener("click", () => {
        expenses.splice(index, 1);
        table.deleteRow(index);
        updateChart();
        checkGoal();
        updateTotal();
    });
    actionCell.appendChild(deleteIcon);

    // Reset the form and set the button back to "Add Expense"
    document.getElementById("expense-form").reset();
    const addButton = document.querySelector("#expense-form button[type='reset']");
    addButton.textContent = "Add Expense";
    addButton.onclick = addExpense;

    // Update the chart and goal
    updateChart();
    checkGoal();
    updateTotal();
}


function updateChart() {
    const categoryTotals = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
    }, {});

    expenseChart.data.labels = Object.keys(categoryTotals);
    expenseChart.data.datasets[0].data = Object.values(categoryTotals);
    expenseChart.update();
}

function setGoal() {
    goalAmount = parseFloat(document.getElementById("goalAmount").value);
    if (isNaN(goalAmount)) {
        alert("Please enter a valid goal amount.");
        return;
    }
    document.getElementById("goalStatus").innerText = `Goal set to: ₹${goalAmount.toFixed(2)}`;
    checkGoal();
}

function checkGoal() {
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const goalStatus = document.getElementById("goalStatus");

    if (goalAmount > 0 && totalSpent > goalAmount) {
        goalStatus.textContent = `You have exceeded your spending goal! You spent ₹${totalSpent.toFixed(2)}. Your goal was ₹${goalAmount.toFixed(2)}.`;
        goalStatus.style.color = 'red';
    } else if (goalAmount > 0) {
        goalStatus.textContent = `You've spent ₹${totalSpent.toFixed(2)}. Your goal is ₹${goalAmount.toFixed(2)}.`;
        goalStatus.style.color = 'green';
    } else {
        goalStatus.textContent = 'Set a spending goal.';
        goalStatus.style.color = 'black';
    }
}

function updateTotal() {
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    let totalRow = document.getElementById("total-row");

    // If total row exists, remove it
    if (totalRow) {
        totalRow.parentNode.removeChild(totalRow);
    }

    // Create and append the total row at the end
    const table = document.getElementById("expense-table").getElementsByTagName("tbody")[0];
    totalRow = table.insertRow();
    totalRow.id = "total-row";
    totalRow.insertCell(0).innerHTML = "<strong>Total</strong>";
    totalRow.insertCell(1).textContent = ""; // Empty cell
    totalRow.insertCell(2).id = "total-amount"; // Add an ID to easily update total amount
    totalRow.insertCell(3).textContent = ""; // Empty cell

    // Update the total amount cell with bold styling
    document.getElementById("total-amount").innerHTML = `<strong>${totalAmount.toFixed(2)}</strong>`;
}

function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("Expense List", 10, 10);

    let y = 20;
    expenses.forEach(expense => {
        doc.text(`Description: ${expense.description}`, 10, y);
        doc.text(`Date: ${expense.date}`, 10, y + 10);
        doc.text(`Amount: ₹${expense.amount.toFixed(2)}`, 10, y + 20);
        doc.text(`Category: ${expense.category}`, 10, y + 30);
        y += 40;
    });

    const canvas = document.getElementById('expenseChart');
    const chartImage = canvas.toDataURL('image/png');
    doc.addPage();
    doc.text("Spending Analysis", 10, 10);
    doc.addImage(chartImage, 'PNG', 10, 20, 180, 180);

    doc.save("expenses.pdf");
}

function exportToExcel() {
    const workbook = XLSX.utils.book_new();
    
    const expenseSheet = XLSX.utils.json_to_sheet(expenses);
    XLSX.utils.book_append_sheet(workbook, expenseSheet, "Expenses");

    const chartData = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
    }, {});

    const chartArray = [["Category", "Amount"]];
    for (const [category, amount] of Object.entries(chartData)) {
        chartArray.push([category, amount]);
    }

    const chartSheet = XLSX.utils.aoa_to_sheet(chartArray);
    XLSX.utils.book_append_sheet(workbook, chartSheet, "Chart Data");

    XLSX.writeFile(workbook, "expenses_with_chart.xlsx");
}

// Dark theme toggle function
function toggleTheme() {
    document.body.classList.toggle("dark-theme");

    const themeIcon = document.getElementById("theme-icon");
    if (document.body.classList.contains("dark-theme")) {
        themeIcon.src = "dark_theme-removebg-preview.png";  // Icon for dark mode
    } else {
        themeIcon.src = "light_theme-removebg-preview.png";  // Icon for light mode
    }
}

document.getElementById("date").addEventListener("click", function () {
    this.showPicker();  // Trigger the date picker on any click inside the input
});
document.addEventListener("DOMContentLoaded", function () {
    // Mock user data (replace this with real user data from login)
    const username = localStorage.getItem("username") || "User"; // Store username in localStorage for simplicity
    const profilePic = document.querySelector(".profile-pic");
  
    // Load existing avatar from localStorage
    const savedAvatar = localStorage.getItem("avatar");
    if (savedAvatar) {
        profilePic.src = savedAvatar; // Use the saved avatar
    }
    
  
    // Update username display
    const welcomeUser = document.getElementById("welcome-user");
    welcomeUser.textContent = `Hi 👋, ${username}`;
  
    // Logout functionality
    const logoutButton = document.getElementById("logout-button");
    logoutButton.addEventListener("click", function () {
        localStorage.removeItem("username"); // Clear user data
        localStorage.removeItem("avatar"); // Clear avatar data
        alert("You have been logged out!");
        window.location.href = "signin.html"; // Redirect to login page
    });

  });

// Make sure the addExpense function is called when the form is submitted
document.querySelector("#expense-form button[type='reset']").onclick = addExpense;

