// ==============================
// Expense Tracker Dashboard
// Part 1
// ==============================

// Local Storage
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Elements
const tbody = document.getElementById("tbody");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const balanceEl = document.getElementById("balance");

const desc = document.getElementById("desc");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const type = document.getElementById("type");
const transactionDate = document.getElementById("transactionDate");

const addBtn = document.getElementById("addBtn");

// Save Local Storage
function saveTransactions() {
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}

// Add Transaction
addBtn.addEventListener("click", addTransaction);

function addTransaction() {

    if (
        desc.value.trim() === "" ||
        amount.value === ""
    ) {

        alert("Please fill all fields.");
        return;
    }

    const transaction = {

        id: Date.now(),

        description: desc.value,

        amount: Number(amount.value),

        category: category.value,

        type: type.value,

        date:
            transactionDate.value ||
            new Date().toLocaleDateString()

    };

    transactions.push(transaction);

    saveTransactions();

    displayTransactions();

    updateSummary();

    clearInputs();
}

// Display Transactions

function displayTransactions() {

    tbody.innerHTML = "";

    transactions.forEach((t) => {

        const row = document.createElement("tr");

        row.innerHTML = `

        <td>${t.description}</td>

        <td>${t.category}</td>

        <td>₹${t.amount}</td>

        <td>${t.type}</td>

        <td>${t.date}</td>

        <td>

        <button
        class="deleteBtn"
        onclick="deleteTransaction(${t.id})">

        Delete

        </button>

        </td>

        `;

        tbody.appendChild(row);

    });

}

// Delete Transaction

function deleteTransaction(id) {

    transactions = transactions.filter(

        transaction => transaction.id !== id

    );

    saveTransactions();

    displayTransactions();

    updateSummary();

}

// Update Dashboard

function updateSummary() {

    let income = 0;

    let expense = 0;

    transactions.forEach((t) => {

        if (t.type === "income") {

            income += t.amount;

        } else {

            expense += t.amount;

        }

    });

    incomeEl.innerHTML = `₹${income}`;

    expenseEl.innerHTML = `₹${expense}`;

    balanceEl.innerHTML = `₹${income - expense}`;

}

// Clear Form

function clearInputs() {

    desc.value = "";

    amount.value = "";

    category.selectedIndex = 0;

    type.selectedIndex = 0;

    transactionDate.value = "";

}

// Initial Load

displayTransactions();

updateSummary();
// ==============================
// Expense Tracker Dashboard
// Part 2
// Search, Filter, Sort, Budget,
// Dark Mode & Toast
// ==============================

// ---------- Elements ----------

const search = document.getElementById("search");
const filter = document.getElementById("filter");

const sortAmount = document.getElementById("sortAmount");
const sortDate = document.getElementById("sortDate");

const budgetInput = document.getElementById("budgetInput");
const saveBudget = document.getElementById("saveBudget");
const remainingBudget = document.getElementById("remainingBudget");

const progressBar = document.getElementById("progressBar");

const themeBtn = document.getElementById("themeBtn");

const toast = document.getElementById("toast");

// ==============================
// Toast Message
// ==============================

function showToast(message){

    toast.innerHTML = message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },2500);

}

// ==============================
// Search
// ==============================

search.addEventListener("keyup",()=>{

    const value = search.value.toLowerCase();

    const rows = tbody.querySelectorAll("tr");

    rows.forEach((row)=>{

        row.style.display =
        row.innerText.toLowerCase().includes(value)
        ? ""
        : "none";

    });

});

// ==============================
// Filter
// ==============================

filter.addEventListener("change",()=>{

    const rows = tbody.querySelectorAll("tr");

    rows.forEach((row)=>{

        const type =
        row.children[3].innerText.toLowerCase();

        if(filter.value==="all"){

            row.style.display="";

        }

        else{

            row.style.display =
            type===filter.value
            ? ""
            : "none";

        }

    });

});

// ==============================
// Sort Amount
// ==============================

sortAmount.addEventListener("click",()=>{

    transactions.sort(

        (a,b)=>a.amount-b.amount

    );

    displayTransactions();

    showToast("Sorted by Amount");

});

// ==============================
// Sort Date
// ==============================

sortDate.addEventListener("click",()=>{

    transactions.sort(

        (a,b)=>

        new Date(b.date)-new Date(a.date)

    );

    displayTransactions();

    showToast("Sorted by Date");

});

// ==============================
// Budget
// ==============================

saveBudget.addEventListener("click",()=>{

    localStorage.setItem(

        "budget",

        budgetInput.value

    );

    updateBudget();

    showToast("Budget Saved");

});

function updateBudget(){

    const budget =

    Number(

    localStorage.getItem("budget")

    ) || 0;

    let totalExpense = 0;

    transactions.forEach((t)=>{

        if(t.type==="expense"){

            totalExpense += t.amount;

        }

    });

    remainingBudget.innerHTML =

    "₹"+(budget-totalExpense);

    const percent =

    budget===0

    ?0

    :(totalExpense/budget)*100;

    progressBar.style.width=

    percent+"%";

    if(percent<50){

        progressBar.style.background="#22c55e";

    }

    else if(percent<80){

        progressBar.style.background="#f59e0b";

    }

    else{

        progressBar.style.background="#ef4444";

    }

}

updateBudget();

// ==============================
// Dark Mode
// ==============================

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    localStorage.setItem(

        "theme",

        document.body.classList.contains("dark")

    );

});

window.addEventListener("load",()=>{

    if(

    localStorage.getItem("theme")

    ==="true"

    ){

        document.body.classList.add("dark");

    }

});

// ==============================
// Override Add Transaction
// ==============================

const oldAdd = addTransaction;

addTransaction = function(){

    oldAdd();

    updateBudget();

    showToast("Transaction Added");

};

// ==============================
// Override Delete
// ==============================

const oldDelete = deleteTransaction;

deleteTransaction = function(id){

    oldDelete(id);

    updateBudget();

    showToast("Transaction Deleted");

};
// ==============================
// Expense Tracker Dashboard
// Part 3A
// Pie Chart, Bar Chart & Line Chart
// ==============================

let pieChart;
let barChart;
let lineChart;

// ------------------------------
// Update Charts
// ------------------------------

function updateCharts() {

    const income = transactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    // ---------------- Pie Chart ----------------

    const pieCanvas = document.getElementById("pieChart");

    if (pieCanvas) {

        if (pieChart) pieChart.destroy();

        pieChart = new Chart(pieCanvas, {

            type: "pie",

            data: {

                labels: ["Income", "Expense"],

                datasets: [{

                    data: [income, expense],

                    backgroundColor: [

                        "#22c55e",

                        "#ef4444"

                    ]

                }]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {

                        position: "bottom"

                    }

                }

            }

        });

    }

    // ---------------- Bar Chart ----------------

    const barCanvas = document.getElementById("barChart");

    if (barCanvas) {

        if (barChart) barChart.destroy();

        barChart = new Chart(barCanvas, {

            type: "bar",

            data: {

                labels: ["Income", "Expense"],

                datasets: [{

                    label: "Amount",

                    data: [income, expense],

                    backgroundColor: [

                        "#2563eb",

                        "#f97316"

                    ]

                }]

            },

            options: {

                responsive: true,

                scales: {

                    y: {

                        beginAtZero: true

                    }

                }

            }

        });

    }

    // ---------------- Line Chart ----------------

    const lineCanvas = document.getElementById("lineChart");

    if (lineCanvas) {

        if (lineChart) lineChart.destroy();

        lineChart = new Chart(lineCanvas, {

            type: "line",

            data: {

                labels: transactions.map(t => t.date),

                datasets: [{

                    label: "Transaction Amount",

                    data: transactions.map(t => t.amount),

                    fill: false,

                    borderColor: "#2563eb",

                    tension: 0.3

                }]

            },

            options: {

                responsive: true

            }

        });

    }

}

// ------------------------------
// Update Charts After Changes
// ------------------------------

const oldSummary = updateSummary;

updateSummary = function () {

    oldSummary();

    updateCharts();

};

// ------------------------------
// Initial Charts
// ------------------------------

updateCharts();
// ==============================
// Expense Tracker Dashboard
// Part 3B
// Final Features
// ==============================

// ---------- Export CSV ----------

const exportBtn = document.getElementById("exportCSV");

if (exportBtn) {

    exportBtn.addEventListener("click", exportCSV);

}

function exportCSV() {

    let csv =
        "Description,Category,Amount,Type,Date\n";

    transactions.forEach((t) => {

        csv +=
            `${t.description},
${t.category},
${t.amount},
${t.type},
${t.date}\n`;

    });

    const blob = new Blob([csv], {

        type: "text/csv"

    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "Expense_Report.csv";

    a.click();

    URL.revokeObjectURL(url);

    showToast("CSV Exported");

}

// ---------- Print Report ----------

const printBtn = document.getElementById("printReport");

if (printBtn) {

    printBtn.addEventListener("click", () => {

        window.print();

    });

}

// ---------- AI Spending Insights ----------

function updateInsights() {

    const insight1 =
        document.getElementById("insight1");

    const insight2 =
        document.getElementById("insight2");

    const insight3 =
        document.getElementById("insight3");

    let expense = 0;

    let income = 0;

    transactions.forEach((t) => {

        if (t.type === "expense") {

            expense += t.amount;

        } else {

            income += t.amount;

        }

    });

    if (insight1) {

        insight1.innerHTML =
            `Total Expense : ₹${expense}`;

    }

    if (insight2) {

        insight2.innerHTML =
            `Total Income : ₹${income}`;

    }

    if (insight3) {

        if (income > expense) {

            insight3.innerHTML =
                "Great! Your savings are increasing.";

        } else {

            insight3.innerHTML =
                "Warning! Expenses are higher than income.";

        }

    }

}

// ---------- Financial Health ----------

function updateHealth() {

    const score =
        document.getElementById("healthScore");

    if (!score) return;

    let income = 0;

    let expense = 0;

    transactions.forEach((t) => {

        if (t.type === "income") {

            income += t.amount;

        } else {

            expense += t.amount;

        }

    });

    let health = 100;

    if (income > 0) {

        health = Math.max(
            0,
            Math.round(
                ((income - expense) / income) * 100
            )
        );

    }

    score.innerHTML = health + "/100";

}

// ---------- Goal Progress ----------

function updateGoals() {

    const goal =
        document.getElementById("goalProgress");

    const goal2 =
        document.getElementById("goalProgress2");

    let savings = 0;

    transactions.forEach((t) => {

        if (t.type === "income") {

            savings += t.amount;

        } else {

            savings -= t.amount;

        }

    });

    const percent1 =
        Math.min((savings / 50000) * 100, 100);

    const percent2 =
        Math.min((savings / 80000) * 100, 100);

    if (goal) {

        goal.style.width =
            percent1 + "%";

    }

    if (goal2) {

        goal2.style.width =
            percent2 + "%";

    }

}

// ---------- Update Everything ----------

const oldRender = render;

render = function () {

    oldRender();

    updateInsights();

    updateHealth();

    updateGoals();

    updateCharts();

    updateBudget();

};

// ---------- Loader ----------

window.addEventListener("load", () => {

    const loader =
        document.getElementById("loader");

    if (loader) {

        setTimeout(() => {

            loader.style.display = "none";

        }, 1000);

    }

});

// ---------- Initialize Dashboard ----------

render();

updateSummary();

updateCharts();

updateBudget();

updateHealth();

updateGoals();

updateInsights();