const API_URL = "http://localhost:5000/api"; // your backend API URL

/* ========== CHECK IF LOGGED IN ========== */
function isLoggedIn() {
  return localStorage.getItem("token") !== null;
}

/* ========== SIGNUP FUNCTION ========== */
async function register() {
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !email || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Signup successful! Please log in.");
      window.location = "login.html"; // redirect to login
    } else {
      alert(data.message || "Signup failed");
    }
  } catch (err) {
    console.error("Signup error:", err);
    alert("Something went wrong. Try again.");
  }
}

/* ========== LOGIN FUNCTION ========== */
async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok) {
      // Save token & userId
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user._id);

      // Redirect to feed or profile
      window.location = "index.html"; 
    } else {
      alert(data.message || "Login failed");
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("Something went wrong. Try again.");
  }
}

/* ========== LOGOUT FUNCTION ========== */
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  window.location = "login.html";
}

/* ========== AUTO REDIRECT IF ALREADY LOGGED IN ========== */
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  // If on login or register page and already logged in → redirect to feed
  if ((path.includes("login.html") || path.includes("register.html")) && isLoggedIn()) {
    window.location = "index.html";
  }
});
