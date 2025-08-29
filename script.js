const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

loginBtn.addEventListener("click", () => {
  loginForm.classList.remove("hidden");
  registerForm.classList.add("hidden");
});

registerBtn.addEventListener("click", () => {
  registerForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
});

// ثبت‌نام
document.getElementById("doRegister").addEventListener("click", async () => {
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  const username = document.getElementById("regUsername").value;

  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // ذخیره پروفایل کاربر
    await db.collection("users").doc(user.uid).set({
      username: username,
      email: email,
      balance: 0
    });

    alert("🎉 ثبت نام موفق! وارد بازی شوید.");
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
    window.location.href = "game.html";
  } catch (error) {
    alert("❌ خطا: " + error.message);
  }
});
