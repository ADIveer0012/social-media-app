function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("username");

  window.location = "login.html";
}

function protectPage() {
  if (!localStorage.getItem("token")) {
    window.location = "login.html";
  }
}

document.addEventListener("DOMContentLoaded", protectPage);
