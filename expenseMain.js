// Global variables
let expenses = [];
let categoryBudgets = {};
let goalAmount = 0;
let expenseChart;
let barChart;
let currentChartType = 'pie';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Load data from localStorage
    loadData();
    
    // Initialize charts
    initializeCharts();
    
    // Set up event listeners
    setupEventListeners();
    
    // Update UI elements
    updateDashboardSummary();
    updateExpenseTable();
    updateChart();
    checkGoal();
    renderCategoryBudgets();
    
    // Show notification banner
    const notificationBanner = document.querySelector('.notification-banner');
    if (localStorage.getItem('hideBanner') === 'true') {
        notificationBanner.style.display = 'none';
    }
    
    // Fix for date input to make it clickable anywhere
    const dateInput = document.getElementById('date');
    dateInput.addEventListener('click', function() {
        this.showPicker();
    });
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    
    // Check for dark theme preference
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        document.getElementById('theme-icon').src = 'dark_theme-removebg-preview.png';
    }
});

// Load data from localStorage
function loadData() {
    // Load expenses
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
        expenses = JSON.parse(savedExpenses);
    } else {
        // Sample data for demonstration
        expenses = [
            { description: 'Grocery Shopping', date: '2024-03-15', amount: 1250, category: 'Food', paymentMethod: 'Credit Card', notes: 'Monthly grocery' },
            { description: 'Movie Tickets', date: '2024-03-18', amount: 500, category: 'Entertainment', paymentMethod: 'UPI', notes: 'Weekend movie' },
            { description: 'Uber Ride', date: '2024-03-20', amount: 350, category: 'Transport', paymentMethod: 'UPI', notes: 'Office commute' },
            { description: 'Electricity Bill', date: '2024-03-22', amount: 1800, category: 'Utilities', paymentMethod: 'Bank Transfer', notes: 'Monthly bill' }
        ];
        saveExpenses();
    }
    
    // Load goal amount
    const savedGoal = localStorage.getItem('goalAmount');
    if (savedGoal) {
        goalAmount = parseFloat(savedGoal);
        document.getElementById('goalAmount').value = goalAmount;
    }
    
    // Load category budgets
    const savedCategoryBudgets = localStorage.getItem('categoryBudgets');
    if (savedCategoryBudgets) {
        categoryBudgets = JSON.parse(savedCategoryBudgets);
    }
    
    // Load user profile
    const username = localStorage.getItem('username');
    if (username) {
        document.getElementById('welcome-user').textContent = `Hi 👋, ${username}`;
    }
    
    const savedAvatar = localStorage.getItem('avatar');
    if (savedAvatar) {
        document.getElementById('profile-pic').src = savedAvatar;
        document.getElementById('avatar-preview').src = savedAvatar;
    }
}

// Save expenses to localStorage
function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Save goal amount to localStorage
function saveGoal() {
    localStorage.setItem('goalAmount', goalAmount.toString());
}

// Save category budgets to localStorage
function saveCategoryBudgets() {
    localStorage.setItem('categoryBudgets', JSON.stringify(categoryBudgets));
}

// Initialize charts
function initializeCharts() {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    
    // Pie chart for category breakdown
    expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#2ecc71', // Green
                    '#3498db', // Blue
                    '#9b59b6', // Purple
                    '#e74c3c', // Red
                    '#f39c12', // Orange
                    '#1abc9c', // Turquoise
                    '#d35400', // Pumpkin
                    '#34495e'  // Dark Blue
                ],
                borderWidth: 1,
                borderColor: '#ffffff',
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-color'),
                        font: {
                            size: 12
                        },
                        padding: 20
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ₹${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Set up event listeners
function setupEventListeners() {
    // Add expense button
    document.getElementById('add-expense-btn').addEventListener('click', addExpense);
    
    // Clear form button
    document.getElementById('clear-form-btn').addEventListener('click', function() {
        document.getElementById('expense-form').reset();
        const addButton = document.getElementById('add-expense-btn');
        addButton.textContent = 'Add Expense';
        addButton.onclick = addExpense;
        
        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;
    });
    
    // Close notification banner
    document.getElementById('close-banner').addEventListener('click', function() {
        document.querySelector('.notification-banner').style.display = 'none';
        localStorage.setItem('hideBanner', 'true');
    });
    
    // Chart tabs
    document.querySelectorAll('.chart-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentChartType = this.dataset.chart;
            updateChart();
        });
    });
    
    // Search expenses
    document.getElementById('search-expenses').addEventListener('input', function() {
        updateExpenseTable();
    });
    
    // Filter by category
    document.getElementById('filter-category').addEventListener('change', function() {
        updateExpenseTable();
    });
    
    // Sort expenses
    document.getElementById('sort-expenses').addEventListener('change', function() {
        updateExpenseTable();
    });
    
    // Delete all button
    document.getElementById('delete-all-btn').addEventListener('click', function() {
        const modal = document.getElementById('confirm-delete-modal');
        modal.style.display = 'flex';
    });
    
    // Confirm delete all
    document.getElementById('confirm-delete-btn').addEventListener('click', function() {
        expenses = [];
        saveExpenses();
        updateExpenseTable();
        updateChart();
        checkGoal();
        updateDashboardSummary();
        document.getElementById('confirm-delete-modal').style.display = 'none';
    });
    
    // Cancel delete all
    document.getElementById('cancel-delete-btn').addEventListener('click', function() {
        document.getElementById('confirm-delete-modal').style.display = 'none';
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Close modal buttons
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Edit profile button
    document.getElementById('edit-profile').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('edit-profile-modal').style.display = 'flex';
    });
    
    // Avatar upload
    document.getElementById('avatar-upload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                document.getElementById('avatar-preview').src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Save profile changes
    document.getElementById('save-profile').addEventListener('click', function() {
        const username = document.getElementById('username').value;
        const avatarSrc = document.getElementById('avatar-preview').src;
        
        if (username) {
            localStorage.setItem('username', username);
            document.getElementById('welcome-user').textContent = `Hi 👋, ${username}`;
        }
        
        localStorage.setItem('avatar', avatarSrc);
        document.getElementById('profile-pic').src = avatarSrc;
        
        document.getElementById('edit-profile-modal').style.display = 'none';
        
        // Show success notification
        showNotification('Profile updated successfully!', 'success');
    });
    
    // // Theme toggle
    // document.querySelector('.theme-toggle').addEventListener('click', toggleTheme);
    
    // Make sure form doesn't submit on enter
    document.getElementById('expense-form').addEventListener('submit', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Window resize event to update chart
    window.addEventListener('resize', function() {
        if (expenseChart) {
            expenseChart.resize();
        }
    });
}

// Add a new expense
function addExpense() {
    const description = document.getElementById('description').value;
    const date = document.getElementById('date').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const paymentMethod = document.getElementById('payment-method').value;
    const notes = document.getElementById('notes').value;

    if (!description || !date || isNaN(amount) || !category || !paymentMethod) {
        showNotification('Please fill all required fields.', 'error');
        return;
    }

    const newExpense = { 
        description, 
        date, 
        amount, 
        category, 
        paymentMethod, 
        notes 
    };
    
    expenses.push(newExpense);
    saveExpenses();
    
    // Reset form with today's date
    document.getElementById('expense-form').reset();
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
    
    updateExpenseTable();
    updateChart();
    checkGoal();
    updateDashboardSummary();
    
    // Show success notification
    showNotification('Expense added successfully!', 'success');
}

// Edit an expense
function editExpense(index) {
    const expense = expenses[index];
    
    document.getElementById('description').value = expense.description;
    document.getElementById('date').value = expense.date;
    document.getElementById('amount').value = expense.amount;
    document.getElementById('category').value = expense.category;
    document.getElementById('payment-method').value = expense.paymentMethod || '';
    document.getElementById('notes').value = expense.notes || '';

    const addButton = document.getElementById('add-expense-btn');
    addButton.textContent = 'Update Expense';
    addButton.onclick = function() {
        updateExpense(index);
    };
    
    // Scroll to form
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

// Update an existing expense
function updateExpense(index) {
    const description = document.getElementById('description').value;
    const date = document.getElementById('date').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const paymentMethod = document.getElementById('payment-method').value;
    const notes = document.getElementById('notes').value;

    if (!description || !date || isNaN(amount) || !category || !paymentMethod) {
        showNotification('Please fill all required fields.', 'error');
        return;
    }

    expenses[index] = { 
        description, 
        date, 
        amount, 
        category, 
        paymentMethod, 
        notes 
    };
    
    saveExpenses();
    
    // Reset form with today's date
    document.getElementById('expense-form').reset();
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
    
    const addButton = document.getElementById('add-expense-btn');
    addButton.textContent = 'Add Expense';
    addButton.onclick = addExpense;
    
    updateExpenseTable();
    updateChart();
    checkGoal();
    updateDashboardSummary();
    
    // Show success notification
    showNotification('Expense updated successfully!', 'success');
}

// Delete an expense
function deleteExpense(index) {
    expenses.splice(index, 1);
    saveExpenses();
    
    updateExpenseTable();
    updateChart();
    checkGoal();
    updateDashboardSummary();
    
    // Show success notification
    showNotification('Expense deleted successfully!', 'success');
}

// Update the expense table
function updateExpenseTable() {
    const table = document.getElementById('expense-table').getElementsByTagName('tbody')[0];
    table.innerHTML = '';
    
    // Get filter values
    const searchTerm = document.getElementById('search-expenses').value.toLowerCase();
    const filterCategory = document.getElementById('filter-category').value;
    const sortOption = document.getElementById('sort-expenses').value;
    
    // Filter expenses
    let filteredExpenses = expenses.filter(expense => {
        const matchesSearch = expense.description.toLowerCase().includes(searchTerm) || 
                             expense.category.toLowerCase().includes(searchTerm) ||
                             (expense.notes && expense.notes.toLowerCase().includes(searchTerm));
        
        const matchesCategory = filterCategory === '' || expense.category === filterCategory;
        
        return matchesSearch && matchesCategory;
    });
    
    // Sort expenses
    filteredExpenses.sort((a, b) => {
        switch (sortOption) {
            case 'date-desc':
                return new Date(b.date) - new Date(a.date);
            case 'date-asc':
                return new Date(a.date) - new Date(b.date);
            case 'amount-desc':
                return b.amount - a.amount;
            case 'amount-asc':
                return a.amount - b.amount;
            default:
                return new Date(b.date) - new Date(a.date);
        }
    });
    
    // Add expenses to table
    if (filteredExpenses.length === 0) {
        const emptyRow = table.insertRow();
        const emptyCell = emptyRow.insertCell(0);
        emptyCell.colSpan = 6;
        emptyCell.textContent = 'No expenses found. Add some expenses to get started!';
        emptyCell.style.textAlign = 'center';
        emptyCell.style.padding = '2rem';
        return;
    }
    
    filteredExpenses.forEach((expense, index) => {
        const row = table.insertRow();
        
        // Find the original index in the expenses array
        const originalIndex = expenses.findIndex(e => 
            e.description === expense.description && 
            e.date === expense.date && 
            e.amount === expense.amount && 
            e.category === expense.category
        );
        
        row.insertCell(0).textContent = expense.description;
        
        const dateCell = row.insertCell(1);
        const expenseDate = new Date(expense.date);
        dateCell.textContent = expenseDate.toLocaleDateString();
        
        const amountCell = row.insertCell(2);
        amountCell.textContent = `₹${expense.amount.toFixed(2)}`;
        amountCell.style.fontWeight = '600';
        
        const categoryCell = row.insertCell(3);
        const categoryBadge = document.createElement('span');
        categoryBadge.textContent = expense.category;
        categoryBadge.className = 'category-badge';
        categoryBadge.style.backgroundColor = getCategoryColor(expense.category);
        categoryCell.appendChild(categoryBadge);
        
        row.insertCell(4).textContent = expense.paymentMethod || 'N/A';
        
        const actionCell = row.insertCell(5);
        actionCell.style.display = 'flex';
        actionCell.style.gap = '0.5rem';
        
        // Edit button
        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="fas fa-edit"></i>';
        editButton.className = 'edit-button';
        editButton.title = 'Edit';
        editButton.addEventListener('click', () => editExpense(originalIndex));
        actionCell.appendChild(editButton);
        
        // Delete button
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteButton.className = 'delete-button';
        deleteButton.title = 'Delete';
        deleteButton.addEventListener('click', () => deleteExpense(originalIndex));
        actionCell.appendChild(deleteButton);
    });
}

// Update the chart
function updateChart() {
    if (currentChartType === 'pie') {
        updatePieChart();
    } else {
        updateBarChart();
    }
}

// Update the pie chart
function updatePieChart() {
    const categoryTotals = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
    }, {});
    
    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);
    
    // Destroy existing chart if it's a bar chart
    if (expenseChart && expenseChart.config.type !== 'pie') {
        expenseChart.destroy();
        const ctx = document.getElementById('expenseChart').getContext('2d');
        expenseChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        '#2ecc71', '#3498db', '#9b59b6', '#e74c3c', 
                        '#f39c12', '#1abc9c', '#d35400', '#34495e'
                    ],
                    borderWidth: 1,
                    borderColor: '#ffffff',
                    hoverOffset: 15
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-color'),
                            font: {
                                size: 12
                            },
                            padding: 20
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ₹${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    } else if (expenseChart) {
        expenseChart.data.labels = labels;
        expenseChart.data.datasets[0].data = data;
        expenseChart.update();
    }
}

// Update the bar chart
function updateBarChart() {
    // Group expenses by month
    const monthlyTotals = {};
    
    expenses.forEach(expense => {
        const date = new Date(expense.date);
        const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
        
        if (!monthlyTotals[monthYear]) {
            monthlyTotals[monthYear] = 0;
        }
        
        monthlyTotals[monthYear] += expense.amount;
    });
    
    // Sort months chronologically
    const sortedMonths = Object.keys(monthlyTotals).sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateA - dateB;
    });
    
    const data = sortedMonths.map(month => monthlyTotals[month]);
    
    // Destroy existing chart if it's a pie chart
    if (expenseChart && expenseChart.config.type !== 'bar') {
        expenseChart.destroy();
        const ctx = document.getElementById('expenseChart').getContext('2d');
        expenseChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sortedMonths,
                datasets: [{
                    label: 'Monthly Expenses',
                    data: data,
                    backgroundColor: '#2ecc71',
                    borderColor: '#27ae60',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `₹${context.raw.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₹' + value;
                            },
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-color')
                        },
                        grid: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
                        }
                    },
                    x: {
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-color')
                        },
                        grid: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
                        }
                    }
                }
            }
        });
    } else if (expenseChart) {
        expenseChart.data.labels = sortedMonths;
        expenseChart.data.datasets[0].data = data;
        expenseChart.update();
    }
}

// Set spending goal
function setGoal() {
    const goalInput = document.getElementById('goalAmount');
    const newGoal = parseFloat(goalInput.value);
    
    if (isNaN(newGoal) || newGoal <= 0) {
        showNotification('Please enter a valid goal amount.', 'error');
        return;
    }
    
    goalAmount = newGoal;
    saveGoal();
    checkGoal();
    updateDashboardSummary();
    
    // Show success notification
    showNotification('Budget goal set successfully!', 'success');
}

// Set category budget
function setCategoryBudget() {
    const category = document.getElementById('budget-category').value;
    const amount = parseFloat(document.getElementById('category-budget-amount').value);
    
    if (!category) {
        showNotification('Please select a category.', 'error');
        return;
    }
    
    if (isNaN(amount) || amount <= 0) {
        showNotification('Please enter a valid budget amount.', 'error');
        return;
    }
    
    categoryBudgets[category] = amount;
    saveCategoryBudgets();
    renderCategoryBudgets();
    
    // Reset form
    document.getElementById('budget-category').value = '';
    document.getElementById('category-budget-amount').value = '';
    
    // Show success notification
    showNotification(`Budget for ${category} set successfully!`, 'success');
}

// Check if goal is met
function checkGoal() {
    if (goalAmount <= 0) {
        document.getElementById('goalStatus').textContent = 'Set a monthly budget to track your spending.';
        document.getElementById('goal-progress-bar').style.width = '0%';
        document.getElementById('goal-percentage').textContent = '0%';
        return;
    }
    
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const percentage = Math.min(Math.round((totalSpent / goalAmount) * 100), 100);
    
    document.getElementById('goal-progress-bar').style.width = `${percentage}%`;
    document.getElementById('goal-percentage').textContent = `${percentage}%`;
    
    if (totalSpent > goalAmount) {
        document.getElementById('goalStatus').textContent = `You've exceeded your monthly budget by ₹${(totalSpent - goalAmount).toFixed(2)}`;
        document.getElementById('goalStatus').style.color = 'var(--danger-color)';
        document.getElementById('goal-progress-bar').style.backgroundColor = 'var(--danger-color)';
    } else {
        document.getElementById('goalStatus').textContent = `You've spent ₹${totalSpent.toFixed(2)} of your ₹${goalAmount.toFixed(2)} monthly budget`;
        document.getElementById('goalStatus').style.color = 'var(--primary-color)';
        document.getElementById('goal-progress-bar').style.backgroundColor = 'var(--primary-color)';
    }
}

// Render category budgets
function renderCategoryBudgets() {
    const container = document.getElementById('category-budgets-list');
    container.innerHTML = '';
    
    if (Object.keys(categoryBudgets).length === 0) {
        container.innerHTML = '<p>No category budgets set. Add some above.</p>';
        return;
    }
    
    // Calculate category totals
    const categoryTotals = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
    }, {});
    
    // Create budget items
    for (const [category, budget] of Object.entries(categoryBudgets)) {
        const spent = categoryTotals[category] || 0;
        const percentage = Math.min(Math.round((spent / budget) * 100), 100);
        
        const item = document.createElement('div');
        item.className = 'category-budget-item';
        
        const categoryName = document.createElement('div');
        categoryName.textContent = category;
        categoryName.style.fontWeight = '500';
        
        const progressContainer = document.createElement('div');
        progressContainer.className = 'category-budget-progress';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'category-budget-bar';
        
        const progressFill = document.createElement('div');
        progressFill.className = 'category-budget-fill';
        progressFill.style.width = `${percentage}%`;
        
        if (spent > budget) {
            progressFill.style.backgroundColor = 'var(--danger-color)';
        }
        
        progressBar.appendChild(progressFill);
        progressContainer.appendChild(progressBar);
        
        const amountText = document.createElement('div');
        amountText.className = 'category-budget-amount';
        amountText.textContent = `₹${spent.toFixed(2)} / ₹${budget.toFixed(2)}`;
        
        if (spent > budget) {
            amountText.style.color = 'var(--danger-color)';
        }
        
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
        deleteBtn.className = 'delete-button';
        deleteBtn.title = 'Remove budget';
        deleteBtn.addEventListener('click', () => {
            delete categoryBudgets[category];
            saveCategoryBudgets();
            renderCategoryBudgets();
        });
        
        item.appendChild(categoryName);
        item.appendChild(progressContainer);
        item.appendChild(amountText);
        item.appendChild(deleteBtn);
        
        container.appendChild(item);
    }
}

// Update dashboard summary
function updateDashboardSummary() {
    // Calculate total expenses
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    document.getElementById('total-expense-amount').textContent = `₹${totalExpenses.toFixed(2)}`;
    
    // Set monthly budget
    document.getElementById('monthly-budget-amount').textContent = goalAmount > 0 ? `₹${goalAmount.toFixed(2)}` : 'Not set';
    
    // Calculate remaining budget
    if (goalAmount > 0) {
        const remaining = goalAmount - totalExpenses;
        const remainingElement = document.getElementById('remaining-amount');
        remainingElement.textContent = `₹${Math.abs(remaining).toFixed(2)}`;
        
        if (remaining < 0) {
            remainingElement.style.color = 'var(--danger-color)';
            remainingElement.textContent = `-₹${Math.abs(remaining).toFixed(2)}`;
        } else {
            remainingElement.style.color = 'var(--primary-color)';
        }
    } else {
        document.getElementById('remaining-amount').textContent = 'N/A';
    }
    
    // Find top category
    const categoryTotals = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
    }, {});
    
    let topCategory = 'None';
    let topAmount = 0;
    
    for (const [category, amount] of Object.entries(categoryTotals)) {
        if (amount > topAmount) {
            topCategory = category;
            topAmount = amount;
        }
    }
    
    document.getElementById('top-category-name').textContent = topCategory !== 'None' ? `${topCategory} (₹${topAmount.toFixed(2)})` : 'None';
}

// Export to PDF
function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(46, 204, 113);
    doc.text('Budget Buddy - Expense Report', 15, 15);
    
    // Add date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 15, 22);
    
    // Add summary
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Summary', 15, 30);
    
    doc.setFontSize(10);
    doc.text(`Total Expenses: ₹${expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)}`, 15, 38);
    
    if (goalAmount > 0) {
        doc.text(`Monthly Budget: ₹${goalAmount.toFixed(2)}`, 15, 44);
        const remaining = goalAmount - expenses.reduce((sum, expense) => sum + expense.amount, 0);
        doc.text(`Remaining Budget: ${remaining >= 0 ? '₹' : '-₹'}${Math.abs(remaining).toFixed(2)}`, 15, 50);
    }
    
    // Add expense list
    doc.setFontSize(14);
    doc.text('Expense List', 15, 60);
    
    let y = 68;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Description', 15, y);
    doc.text('Date', 70, y);
    doc.text('Category', 100, y);
    doc.text('Amount', 140, y);
    doc.text('Payment', 170, y);
    
    y += 6;
    doc.setTextColor(0, 0, 0);
    
    // Sort expenses by date (newest first)
    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedExpenses.forEach(expense => {
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
        
        doc.text(expense.description.substring(0, 30), 15, y);
        doc.text(new Date(expense.date).toLocaleDateString(), 70, y);
        doc.text(expense.category, 100, y);
        doc.text(`₹${expense.amount.toFixed(2)}`, 140, y);
        doc.text(expense.paymentMethod || 'N/A', 170, y);
        
        y += 8;
    });
    
    // Add chart
    try {
        const canvas = document.getElementById('expenseChart');
        
        // Temporarily switch to pie chart if not already
        let wasBarChart = false;
        if (currentChartType !== 'pie') {
            wasBarChart = true;
            document.querySelector('.chart-tab[data-chart="pie"]').click();
        }
        
        // Wait for chart to update
        setTimeout(() => {
            const chartImage = canvas.toDataURL('image/png');
            
            doc.addPage();
            doc.setFontSize(14);
            doc.text('Spending Analysis', 15, 15);
            
            doc.addImage(chartImage, 'PNG', 15, 25, 180, 150);
            
            // Switch back to bar chart if needed
            if (wasBarChart) {
                document.querySelector('.chart-tab[data-chart="bar"]').click();
            }
            
            doc.save('budget_buddy_report.pdf');
            
            // Show success notification
            showNotification('PDF exported successfully!', 'success');
        }, 300);
    } catch (error) {
        console.error('Error adding chart to PDF:', error);
        doc.save('budget_buddy_report.pdf');
        showNotification('PDF exported with an error in chart generation.', 'error');
    }
}

// Export to Excel
function exportToExcel() {
    const workbook = XLSX.utils.book_new();
    
    // Format expenses for Excel
    const formattedExpenses = expenses.map(expense => ({
        Description: expense.description,
        Date: new Date(expense.date).toLocaleDateString(),
        Amount: expense.amount,
        Category: expense.category,
        'Payment Method': expense.paymentMethod || 'N/A',
        Notes: expense.notes || ''
    }));
    
    // Create expenses sheet
    const expenseSheet = XLSX.utils.json_to_sheet(formattedExpenses);
    XLSX.utils.book_append_sheet(workbook, expenseSheet, 'Expenses');
    
    // Create summary sheet
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remaining = goalAmount - totalExpenses;
    
    const summaryData = [
        ['Budget Buddy - Summary Report', ''],
        ['Generated on', new Date().toLocaleDateString()],
        ['', ''],
        ['Total Expenses', totalExpenses],
        ['Monthly Budget', goalAmount],
        ['Remaining Budget', remaining],
        ['', ''],
        ['Category Breakdown', '']
    ];
    
    // Add category breakdown
    const categoryTotals = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
    }, {});
    
    for (const [category, amount] of Object.entries(categoryTotals)) {
        summaryData.push([category, amount]);
    }
    
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
    
    // Create category budgets sheet if any exist
    if (Object.keys(categoryBudgets).length > 0) {
        const budgetData = [['Category', 'Budget', 'Spent', 'Remaining', 'Percentage']];
        
        for (const [category, budget] of Object.entries(categoryBudgets)) {
            const spent = categoryTotals[category] || 0;
            const remaining = budget - spent;
            const percentage = Math.round((spent / budget) * 100);
            
            budgetData.push([category, budget, spent, remaining, `${percentage}%`]);
        }
        
        const budgetSheet = XLSX.utils.aoa_to_sheet(budgetData);
        XLSX.utils.book_append_sheet(workbook, budgetSheet, 'Category Budgets');
    }
    
    // Save the workbook
    XLSX.writeFile(workbook, 'budget_buddy_report.xlsx');
    
    // Show success notification
    showNotification('Excel exported successfully!', 'success');
}

// Toggle dark/light theme
// function toggleTheme() {
//     document.body.classList.toggle('dark-theme');
    
//     const themeIcon = document.getElementById('theme-icon');
//     if (document.body.classList.contains('dark-theme')) {
//         themeIcon.src = 'dark_theme-removebg-preview.png';
//         localStorage.setItem('theme', 'dark');
//     } else {
//         themeIcon.src = 'light_theme-removebg-preview.png';
//         localStorage.setItem('theme', 'light');
//     }
    
    // Update chart colors to match theme
//     if (expenseChart) {
//         expenseChart.options.plugins.legend.labels.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
        
//         if (expenseChart.config.type === 'bar') {
//             expenseChart.options.scales.y.ticks.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
//             expenseChart.options.scales.x.ticks.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
//             expenseChart.options.scales.y.grid.color = getComputedStyle(document.documentElement).getPropertyValue('--border-color');
//             expenseChart.options.scales.x.grid.color = getComputedStyle(document.documentElement).getPropertyValue('--border-color');
//         }
        
//         expenseChart.update();
//     }
// }

// Get color for category
function getCategoryColor(category) {
    const colors = {
        'Food': '#2ecc71',
        'Transport': '#3498db',
        'Entertainment': '#9b59b6',
        'Shopping': '#e74c3c',
        'Utilities': '#f39c12',
        'Health': '#1abc9c',
        'Education': '#d35400',
        'Other': '#34495e'
    };
    
    return colors[category] || '#7f8c8d';
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Ensure date input works properly on all devices
document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('date');
    
    // Make sure clicking anywhere on the date input opens the date picker
    dateInput.addEventListener('click', function() {
        this.showPicker();
    });
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    
    // Fix for mobile responsiveness
    function adjustForMobile() {
        if (window.innerWidth <= 576) {
            // Adjust chart container height for better mobile view
            document.querySelector('.chart-container').style.height = '200px';
            
            // Make expense actions stack on mobile
            const expenseActions = document.querySelector('.expense-actions');
            if (expenseActions) {
                expenseActions.style.flexDirection = 'column';
                
                // Make buttons full width
                const buttons = expenseActions.querySelectorAll('button');
                buttons.forEach(button => {
                    button.style.width = '100%';
                });
            }
        } else {
            // Reset for larger screens
            document.querySelector('.chart-container').style.height = '300px';
            
            const expenseActions = document.querySelector('.expense-actions');
            if (expenseActions) {
                expenseActions.style.flexDirection = 'row';
                
                const buttons = expenseActions.querySelectorAll('button');
                buttons.forEach(button => {
                    button.style.width = 'auto';
                });
            }
        }
    }
    
    // Run on load and resize
    adjustForMobile();
    window.addEventListener('resize', adjustForMobile);
});
// Toggle dark/light theme
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    
    const themeIcon = document.getElementById('theme-icon');
    if (document.body.classList.contains('dark-theme')) {
        themeIcon.src = 'dark_theme-removebg-preview.png';
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.src = 'light_theme-removebg-preview.png';
        localStorage.setItem('theme', 'light');
    }
    
    // Update chart colors to match theme
    if (expenseChart) {
        expenseChart.options.plugins.legend.labels.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
        
        if (expenseChart.config.type === 'bar') {
            expenseChart.options.scales.y.ticks.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
            expenseChart.options.scales.x.ticks.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
            expenseChart.options.scales.y.grid.color = getComputedStyle(document.documentElement).getPropertyValue('--border-color');
            expenseChart.options.scales.x.grid.color = getComputedStyle(document.documentElement).getPropertyValue('--border-color');
        }
        
        expenseChart.update();
    }
    
    // Show notification
    showNotification(`${document.body.classList.contains('dark-theme') ? 'Dark' : 'Light'} theme activated`, 'success');
}

// Check for theme preference on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if theme preference exists
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        document.getElementById('theme-icon').src = 'dark_theme-removebg-preview.png';
    } else {
        document.body.classList.remove('dark-theme');
        document.getElementById('theme-icon').src = 'light_theme-removebg-preview.png';
    }
});