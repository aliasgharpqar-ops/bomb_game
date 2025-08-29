// اتصال به Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// کانفیگ پروژه‌ت
const firebaseConfig = {
  apiKey: "AIzaSyBadO2yve513BzRqzF_4U44-Yj_cBgQgcw",
  authDomain: "bombgame-d85f5.firebaseapp.com",
  projectId: "bombgame-d85f5",
  storageBucket: "bombgame-d85f5.firebasestorage.app",
  messagingSenderId: "439739695924",
  appId: "1:439739695924:web:93a6d282ec7e0debee5b61",
  measurementId: "G-WVC57S6PJW"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// المان‌ها
const balanceEl = document.getElementById("balance");
const usernameEl = document.getElementById("username");
const betInput = document.getElementById("betAmount");
const placeBetBtn = document.getElementById("placeBet");
const gameCanvas = document.getElementById("gameCanvas");
const ctx = gameCanvas.getContext("2d");

let currentUser = null;
let balance = 0;
let bet = 0;
let multiplier = 1.00;
let crashPoint = 0;
let gameInterval = null;
let isBetting = false;
let hasCashedOut = false;

// ورود کاربر
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("باید وارد حساب کاربری شوید!");
    window.location.href = "index.html";
    return;
  }

  currentUser = user;
  usernameEl.innerText = user.email;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    balance = userSnap.data().balance || 0;
    balanceEl.innerText = balance.toLocaleString("fa-IR") + " تومان";
  }
});

// شروع بازی
function startGame() {
  ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  multiplier = 1.00;
  crashPoint = (Math.random() * 5 + 1).toFixed(2); // رندوم بین 1 تا 6
  isBetting = true;
  hasCashedOut = false;

  gameInterval = setInterval(updateGame, 100);
}

// آپدیت بازی
function updateGame() {
  ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

  // نمودار
  ctx.beginPath();
  ctx.moveTo(50, gameCanvas.height - 50);
  ctx.lineTo(50 + multiplier * 50, gameCanvas.height - 50 - multiplier * 10);
  ctx.strokeStyle = "lime";
  ctx.lineWidth = 3;
  ctx.stroke();

  // متن ضریب
  ctx.fillStyle = "white";
  ctx.font = "20px Vazirmatn";
  ctx.fillText(multiplier.toFixed(2) + "x", 50, 40);

  multiplier += 0.05;

  if (multiplier >= crashPoint) {
    clearInterval(gameInterval);
    if (isBetting && !hasCashedOut) {
      alert("💥 بازی ترکید! باختی.");
      bet = 0;
      placeBetBtn.innerText = "ثبت شرط";
      isBetting = false;
    }
  }
}

// ثبت شرط یا برداشت
placeBetBtn.addEventListener("click", async () => {
  if (!isBetting) {
    bet = parseInt(betInput.value);

    if (bet > balance) {
      alert("❌ موجودی کافی نیست");
      return;
    }

    balance -= bet;
    await updateDoc(doc(db, "users", currentUser.uid), { balance });
    balanceEl.innerText = balance.toLocaleString("fa-IR") + " تومان";

    placeBetBtn.innerText = "برداشت 🔥";
    startGame();

  } else if (!hasCashedOut) {
    const win = Math.floor(bet * multiplier);
    balance += win;

    await updateDoc(doc(db, "users", currentUser.uid), { balance });
    balanceEl.innerText = balance.toLocaleString("fa-IR") + " تومان";

    alert(`🎉 بردی! مبلغ: ${win.toLocaleString("fa-IR")} تومان`);
    hasCashedOut = true;
    placeBetBtn.innerText = "ثبت شرط";
  }
});
