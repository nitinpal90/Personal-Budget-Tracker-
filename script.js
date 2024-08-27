// Currency symbols for display
const currencySymbols = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'INR': '₹',
    'JPY': '¥'
};

// Track income and expenses
let incomeList = [];
let expenseList = [];

// Helper function to format currency
function formatCurrency(amount, currency) {
    const symbol = currencySymbols[currency] || '';
    return `${symbol}${amount.toFixed(2)}`;
}

// Update summary
function updateSummary() {
    const totalIncome = incomeList.reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpenses = expenseList.reduce((acc, curr) => acc + curr.amount, 0);
    const balance = totalIncome - totalExpenses;

    // Set currency from first income entry or default to USD
    const currency = incomeList.length > 0 ? incomeList[0].currency : 'USD';

    document.getElementById('total-income').textContent = formatCurrency(totalIncome, currency);
    document.getElementById('total-expenses').textContent = formatCurrency(totalExpenses, currency);
    document.getElementById('balance').textContent = formatCurrency(balance, currency);

    // Personalized insights
    const insights = getPersonalizedInsights();
    document.getElementById('insights').textContent = insights;
}

function getPersonalizedInsights() {
    const totalIncome = incomeList.reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpenses = expenseList.reduce((acc, curr) => acc + curr.amount, 0);
    let insights = '';

    if (totalIncome > 0) {
        if (totalExpenses > 0) {
            const expenseRatio = (totalExpenses / totalIncome * 100).toFixed(2);
            insights = `Your expenses are ${expenseRatio}% of your total income.`;
        } else {
            insights = 'You have no expenses recorded yet.';
        }
    } else {
        insights = 'You have no income recorded yet.';
    }

    return insights;
}

// Handle income form submission
document.getElementById('income-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const source = document.getElementById('income-source').value;
    const amount = parseFloat(document.getElementById('income-amount').value);
    const date = document.getElementById('income-date').value;
    const currency = document.getElementById('income-currency').value;

    incomeList.push({ source, amount, date, currency });
    
    updateSummary();
    this.reset(); // Clear the form
});

// Handle expense form submission
document.getElementById('expense-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const category = document.getElementById('expense-category').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const date = document.getElementById('expense-date').value;
    const currency = document.getElementById('expense-currency').value;

    expenseList.push({ category, amount, date, currency });
    
    updateSummary();
    this.reset(); // Clear the form
});

// Handle export data
document.getElementById('export-btn').addEventListener('click', function() {
    const data = {
        incomeList,
        expenseList
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'budget-data.json';
    a.click();
    URL.revokeObjectURL(url);
});

// Handle import data
document.getElementById('import-file').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
        const reader = new FileReader();
        reader.onload = function(e) {
            const data = JSON.parse(e.target.result);
            incomeList = data.incomeList || [];
            expenseList = data.expenseList || [];
            updateSummary();
        };
        reader.readAsText(file);
    } else {
        alert('Please upload a valid JSON file.');
    }
});
