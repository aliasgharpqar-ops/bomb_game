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

// کلیک روی "ورود"
document.getElementById("doLogin").addEventListener("click", () => {
  alert("✅ ورود موفق (این فقط تستیه)");
});

// کلیک روی "ثبت‌نام"
document.getElementById("doRegister").addEventListener("click", () => {
  alert("🎉 ثبت‌نام موفق (این فقط تستیه)");
});
