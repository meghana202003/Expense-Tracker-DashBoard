const text = document.getElementById("text");

const count = document.getElementById("count");

const buttons = document.querySelector(".buttons");

const envelope = document.querySelector(".envelope");

const letter = document.getElementById("letter");

const yesBtn = document.getElementById("yesBtn");

const noBtn = document.getElementById("noBtn");

const messages = [

"Hey You 🌸",

"I've been wanting to tell you something 💌",

"You became my favorite notification ✨",

"You make ordinary days feel beautiful 🌷",

"You make me smile unexpectedly 😊",

"You are genuinely special to me 💖",

"And honestly...",

"I think I've fallen for you ❤️",

"So here's my question...",

"Will you be my boyfriend? 🥺"

];

let i = 0;

function showMessage(){

if(i < messages.length){

count.textContent = `${i+1}/${messages.length}`;

text.textContent = messages[i];

i++;

setTimeout(showMessage,2000);

}

else{

buttons.style.display = "flex";

}

}

showMessage();

yesBtn.addEventListener("click",function(){

text.innerHTML = `

<h2 style="color:#ff4f88">

Yayyyyy ❤️✨

</h2>

<p>

You just made my heart so happy!

</p>

`;

buttons.style.display = "none";

envelope.style.display = "block";

});

noBtn.addEventListener("click",function(){

alert("Take your time 😊💕");

});

envelope.addEventListener("click",function(){

letter.style.display = "block";

envelope.style.display = "none";

});
