const API_URL = "http://localhost:5000/api";

async function loadProfile() {

  const userId = localStorage.getItem("userId");

  const resUser = await fetch(`${API_URL}/users/${userId}`);
  const user = await resUser.json();

  document.getElementById("username").innerText = user.username;
  document.getElementById("followers").innerText = user.followers.length;
  document.getElementById("following").innerText = user.following.length;

  // Load user's posts
  const resPosts = await fetch(`${API_URL}/posts`);
  const posts = await resPosts.json();

  const myPosts = posts.filter(p => p.user._id === userId);

  document.getElementById("posts").innerText = myPosts.length;

  const grid = document.getElementById("user-posts");
  grid.innerHTML = "";

  myPosts.forEach(p => {
    grid.innerHTML += `
      <div class="post-card">
        <img src="${p.image}" />
      </div>
    `;
  });
}

document.addEventListener("DOMContentLoaded", loadProfile);
