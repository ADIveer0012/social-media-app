const API_URL = "http://localhost:5000/api";

/* ========== AUTH CHECK ========== */
function isLoggedIn() {
  return localStorage.getItem("token") !== null;
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  window.location = "login.html";
}

/* ========== FEED ========== */
async function loadFeed() {
  if (!isLoggedIn()) return;

  const feed = document.getElementById("feed");
  if (!feed) return;

  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${API_URL}/posts`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const posts = await res.json();

    feed.innerHTML = "";
    posts.forEach(post => {
      feed.innerHTML += `
        <div class="post" onclick="viewPost('${post._id}')">
          <div class="post-header">
            <img src="https://i.pravatar.cc/150?u=${post.user._id}" />
            <b>${post.user.username}</b>
          </div>
          <img class="post-image" src="${post.image}" />
          <div class="post-actions">
            <span onclick="likePost(event,'${post._id}')">❤️</span>
            <div class="likes">${post.likes.length} likes</div>
          </div>
          <div class="caption"><b>${post.user.username}</b> ${post.caption}</div>
        </div>
      `;
    });
  } catch (err) {
    console.error(err);
  }
}

/* Prevent post click when clicking like */
async function likePost(event, postId) {
  event.stopPropagation();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  try {
    await fetch(`${API_URL}/posts/like/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ userId })
    });
    loadFeed();
  } catch (err) { console.error(err); }
}

/* ========== PROFILE ========== */
async function loadProfile() {
  if (!isLoggedIn()) { window.location = "login.html"; return; }

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const usernameEl = document.getElementById("username");
  const postsCountEl = document.getElementById("posts");
  const followersEl = document.getElementById("followers");
  const followingEl = document.getElementById("following");
  const postsGrid = document.getElementById("user-posts");

  try {
    const resUser = await fetch(`${API_URL}/auth/user/${userId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const user = await resUser.json();
    usernameEl.innerText = user.username;
    followersEl.innerText = user.followers || 0;
    followingEl.innerText = user.following || 0;

    // Follow/Unfollow button
    if (!document.getElementById("follow-btn")) {
      const followBtn = document.createElement("button");
      followBtn.id = "follow-btn";
      followBtn.innerText = user.isFollowing ? "Unfollow" : "Follow";
      followBtn.onclick = () => toggleFollow(userId);
      usernameEl.parentNode.appendChild(followBtn);
    }

    const resPosts = await fetch(`${API_URL}/posts?userId=${userId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const posts = await resPosts.json();
    postsCountEl.innerText = posts.length;

    postsGrid.innerHTML = "";
    posts.forEach(post => {
      postsGrid.innerHTML += `
        <div class="post-card" onclick="viewPost('${post._id}')">
          <img src="${post.image}" alt="Post" />
        </div>
      `;
    });

  } catch (err) { console.error(err); }
}

/* ========== FOLLOW/UNFOLLOW ========== */
async function toggleFollow(targetUserId) {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  try {
    const res = await fetch(`${API_URL}/auth/follow/${targetUserId}`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify({ userId })
    });
    const data = await res.json();
    document.getElementById("follow-btn").innerText = data.isFollowing ? "Unfollow" : "Follow";
    loadProfile();
  } catch (err) { console.error(err); }
}

/* ========== POST MODAL & COMMENTS ========== */
let currentPostId = null;

async function viewPost(postId) {
  currentPostId = postId;
  const token = localStorage.getItem("token");
  const modal = document.getElementById("post-modal");
  const modalPost = document.getElementById("modal-post");
  const modalComments = document.getElementById("modal-comments");
  modal.style.display = "flex";

  try {
    const res = await fetch(`${API_URL}/posts/${postId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const post = await res.json();

    modalPost.innerHTML = `
      <div class="post-header">
        <img src="https://i.pravatar.cc/150?u=${post.user._id}" />
        <b>${post.user.username}</b>
      </div>
      <img class="post-image" src="${post.image}" />
      <div class="post-actions">
        <span onclick="likePost(event,'${post._id}')">❤️</span>
        <div class="likes">${post.likes.length} likes</div>
      </div>
      <div class="caption"><b>${post.user.username}</b> ${post.caption}</div>
    `;

    modalComments.innerHTML = "";
    post.comments.forEach(c => {
      modalComments.innerHTML += `<div><b>${c.user.username}</b> ${c.text}</div>`;
    });

  } catch (err) { console.error(err); }
}

function closeModal() {
  document.getElementById("post-modal").style.display = "none";
  currentPostId = null;
}

async function addComment() {
  const commentText = document.getElementById("comment-input").value.trim();
  if (!commentText || !currentPostId) return;

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  try {
    await fetch(`${API_URL}/posts/comment/${currentPostId}`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ userId, text: commentText })
    });
    document.getElementById("comment-input").value = "";
    viewPost(currentPostId);
    loadFeed();
  } catch (err) { console.error(err); }
}

/* ========== AUTO LOAD ========== */
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  if (!isLoggedIn() && 
      (path.includes("index.html") || path.includes("profile.html"))) {
    window.location = "login.html";
    return;
  }

  if (path.includes("index.html")) loadFeed();
  else if (path.includes("profile.html")) loadProfile();
});
