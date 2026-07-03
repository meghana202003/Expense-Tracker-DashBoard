// ===== DOM Elements =====

const desc = document.querySelector("#desc");
const amount = document.querySelector("#amount");
const category = document.querySelector("#category");
const type = document.querySelector("#type");

const addBtn = document.querySelector("#addBtn");
const tbody = document.querySelector("#tbody");

const incomeEl = document.querySelector("#income");
const expenseEl = document.querySelector("#expense");
const balanceEl = document.querySelector("#balance");

const search = document.querySelector("#search");
const filter = document.querySelector("#filter");

const themeBtn = document.querySelector("#themeBtn");

// ===== State =====

let transactions =
JSON.parse(localStorage.getItem("transactions"))
|| [];

let chart;


// ========================
// Save Data
// ========================

function save() {

localStorage.setItem(

"transactions",

JSON.stringify(transactions)

);

}


// ========================
// Add Transaction
// ========================

function addTransaction() {

if(

desc.value.trim()===""

||

amount.value===""

){

alert(

"Please fill all fields"

);

return;

}

const transaction = {

id: crypto.randomUUID(),

description:

desc.value,

amount:

Number(

amount.value

),

category:

category.value,

type:

type.value,

date:

new Date()

.toLocaleDateString()

};

transactions.push(

transaction

);

save();

render();

clearInputs();

}


// ========================
// Clear Inputs
// ========================

function clearInputs(){

desc.value="";

amount.value="";

category.selectedIndex=0;

type.selectedIndex=0;

}


// ========================
// Delete
// ========================

function deleteTransaction(id){

transactions =

transactions.filter(

t => t.id !== id

);

save();

render();

}


// ========================
// Summary
// ========================

function calculateSummary(){

const income =

transactions

.filter(

t =>

t.type==="income"

)

.reduce(

(sum,t)=>

sum+t.amount,

0

);

const expense =

transactions

.filter(

t =>

t.type==="expense"

)

.reduce(

(sum,t)=>

sum+t.amount,

0

);

incomeEl.textContent =

`₹${income}`;

expenseEl.textContent =

`₹${expense}`;

balanceEl.textContent =

`₹${income-expense}`;

updateChart(

income,

expense

);

}


// ========================
// Render Table
// ========================

function render(

list = transactions

){

tbody.innerHTML="";

list.forEach(

t=>{

const row =

document.createElement(

"tr"

);

row.innerHTML = `

<td>

${t.description}

</td>

<td>

${t.category}

</td>

<td>

₹${t.amount}

</td>

<td>

${t.type}

</td>

<td>

${t.date}

</td>

<td>

<button

class="delete"

data-id="${t.id}"

>

Delete

</button>

</td>

`;

tbody.append(

row

);

}

);

calculateSummary();

}


// ========================
// Search
// ========================

search.addEventListener(

"input",

()=>{

const value =

search.value

.toLowerCase();

const filtered =

transactions.filter(

t=>

t.description

.toLowerCase()

.includes(value)

);

render(filtered);

}

);


// ========================
// Filter
// ========================

filter.addEventListener(

"change",

()=>{

const value =

filter.value;

if(

value==="all"

){

render();

return;

}

const filtered =

transactions.filter(

t=>

t.type===value

);

render(

filtered

);

}

);


// ========================
// Event Delegation
// ========================

tbody.addEventListener(

"click",

e=>{

if(

e.target.classList

.contains(

"delete"

)

){

deleteTransaction(

e.target.dataset.id

);

}

}

);


// ========================
// Chart
// ========================

function updateChart(

income,

expense

){

const ctx =

document.getElementById(

"myChart"

);

if(chart){

chart.destroy();

}

chart = new Chart(

ctx,

{

type:"doughnut",

data:{

labels:[

"Income",

"Expense"

],

datasets:[{

data:[

income,

expense

],

backgroundColor:[

"#22c55e",

"#ef4444"

],

borderWidth:0

}]

},

options:{

responsive:true,

plugins:{

legend:{

position:

"bottom"

}

}

}

}

);

}


// ========================
// Dark Mode
// ========================

themeBtn

.addEventListener(

"click",

()=>{

document.body

.classList.toggle(

"dark"

);

localStorage

.setItem(

"theme",

document.body

.classList.contains(

"dark"

)

);

}

);


// ========================
// Load Theme
// ========================

if(

localStorage.getItem(

"theme"

)==="true"

){

document.body

.classList.add(

"dark"

);

}


// ========================
// Add Button
// ========================

addBtn.addEventListener(

"click",

addTransaction

);


// ========================
// Initial Render
// ========================

render();
