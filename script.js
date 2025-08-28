// === Firebase Init ===
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

// کانفیگ پروژه شما
const firebaseConfig = {
  apiKey: "AIzaSyBadO2yve513BzRqzF_4U44-Yj_cBgQgcw",
  authDomain: "bombgame-d85f5.firebaseapp.com",
  projectId: "bombgame-d85f5",
  storageBucket: "bombgame-d85f5.firebasestorage.app",
  messagingSenderId: "439739695924",
  appId: "1:439739695924:web:93a6d282ec7e0debee5b61",
  measurementId: "G-WVC57S6PJW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;
let balance = 0;

// === UI Elements ===
const authBox = document.getElementById("authBox");
const gameContainer = document.getElementById("gameContainer");
const authMsg = document.getElementById("authMsg");

const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const usernameDisplay = document.getElementById("usernameDisplay");
const balanceDisplay = document.getElementById("balanceDisplay");

const betAmount = document.getElementById("betAmount");
const betBtn = document.getElementById("betBtn");
const betInfo = document.getElementById("betInfo");

const canvas = document.getElementById("chartCanvas");
const ctx = canvas.getContext("2d");
const multiplierDisplay = document.getElementById("multiplierDisplay");

const historyBody = document.querySelector("#historyTable tbody");

let gameInterval, crashPoint, multiplier, isBetting = false, betValue = 0;
let timer = 5;

// === Auth Events ===
signupBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, pass);
    await setDoc(doc(db, "users", userCred.user.uid), {
      email: email,
      balance: 0
    });
    authMsg.textContent = "ثبت نام موفق!";
  } catch (err) {
    authMsg.textContent = "خطا: " + err.message;
  }
});

loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  try {
    await signInWithEmailAndPassword(auth, email, pass);
  } catch (err) {
    authMsg.textContent = "خطا: " + err.message;
  }
});

logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
});

// === Listen Auth Changes ===
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    const userDoc = await getDoc(doc(db, "users", user.uid));
    balance = userDoc.data().balance;

    usernameDisplay.textContent = user.email;
    balanceDisplay.textContent = balance + " تومان";

    authBox.style.display = "none";
    gameContainer.style.display = "block";

    startTimer();
  } else {
    currentUser = null;
    authBox.style.display = "block";
    gameContainer.style.display = "none";
  }
});

// === Game Functions ===
function startTimer() {
  timer = 5;
  multiplier = 1;
  isBetting = false;
  multiplierDisplay.textContent = "شروع در: " + timer;

  const countdown = setInterval(() => {
    timer--;
    multiplierDisplay.textContent = "شروع در: " + timer;

    if (timer <= 0) {
      clearInterval(countdown);
      startGame();
    }
  }, 1000);
}

function startGame() {
  crashPoint = (Math.random() * 5 + 1).toFixed(2); // نقطه کرش رندوم
  multiplier = 1;

  gameInterval = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    multiplier += 0.05;
    multiplierDisplay.textContent = multiplier.toFixed(2) + "x";

    ctx.beginPath();
    ctx.moveTo(50, canvas.height - 30);
    ctx.lineTo(50 + multiplier * 30, canvas.height - multiplier * 20);
    ctx.strokeStyle = "#2ecc71";
    ctx.lineWidth = 2;
    ctx.stroke();

    if (isBetting) {
      let profit = (betValue * multiplier).toFixed(0);
      betInfo.textContent = "شرط: " + betValue + " تومان | سود فعلی: " + profit + " تومان";
    }

    if (multiplier >= crashPoint) {
      clearInterval(gameInterval);
      multiplierDisplay.textContent = "ترکید! (" + crashPoint + "x)";

      if (isBetting) {
        betInfo.textContent = "باختید ❌";
      }

      setTimeout(startTimer, 3000);
    }
  }, 200);
}

// === Bet Button ===
betBtn.addEventListener("click", async () => {
  if (!isBetting) {
    betValue = parseInt(betAmount.value);

    if (betValue > balance) {
      betInfo.textContent = "❌ موجودی کافی نیست!";
      return;
    }

    balance -= betValue;
    await updateDoc(doc(db, "users", currentUser.uid), { balance: balance });
    balanceDisplay.textContent = balance + " تومان";

    isBetting = true;
    betBtn.textContent = "برداشت 💰";
    betInfo.textContent = "شرط ثبت شد: " + betValue + " تومان";

  } else {
    let profit = Math.floor(betValue * multiplier);
    balance += profit;
    await updateDoc(doc(db, "users", currentUser.uid), { balance: balance });
    balanceDisplay.textContent = balance + " تومان";

    historyBody.innerHTML += `<tr>
      <td>${betValue}</td>
      <td>${multiplier.toFixed(2)}x</td>
      <td>${profit}</td>
    </tr>`;

    betInfo.textContent = "بردید ✅ " + profit + " تومان";

    isBetting = false;
    betBtn.textContent = "ثبت شرط";
  }
});
