// گرفتن دکمه‌ها
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

// نمایش فرم ورود
loginBtn.addEventListener("click", () => {
  loginForm.classList.remove("hidden");
  registerForm.classList.add("hidden");
});

// نمایش فرم ثبت‌نام
registerBtn.addEventListener("click", () => {
  registerForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
});

// ثبت‌نام
document.getElementById("doRegister").addEventListener("click", async () => {
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  try {
    await auth.createUserWithEmailAndPassword(email, password);
    alert("🎉 ثبت نام موفق!");
  } catch (error) {
    alert("❌ خطا: " + error.message);
  }
});

// ورود
document.getElementById("doLogin").addEventListener("click", async () => {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    await auth.signInWithEmailAndPassword(email, password);
    alert("✅ ورود موفق!");
    // اینجا می‌تونی ریدایرکت کنی به صفحه بازی
    // window.location.href = "game.html";
  } catch (error) {
    alert("❌ خطا: " + error.message);
  }
});
