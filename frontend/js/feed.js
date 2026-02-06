const API_URL = "http://localhost:5000/api";

/* =========================
   CHECK LOGIN
========================= */
function isLoggedIn() {
  return localStorage.getItem("token") !== null;
}

/* =========================
   LOAD FEED
========================= */
async function loadFeed() {
  const feed = document.getElementById("feed");
  if (!feed) return;

  try {
    const res = await fetch(`${API_URL}/posts`);
    const posts = await res.json();

    feed.innerHTML = "";

    posts.forEach(post => {
      feed.innerHTML += `
        <div class="post">

          <!-- Post Header -->
          <div class="post-header">
            <img src="https://i.pravatar.cc/150?u=${post.user._id}" />
            <b>${post.user.username}</b>
          </div>

          <!-- Post Image -->
          <img class="post-image" src="${post.image}" />

          <!-- Actions -->
          <div class="post-actions">
            <span onclick="likePost('${post._id}')">❤️</span>
            <div class="likes">${post.likes.length} likes</div>
          </div>

          <!-- Caption -->
          <div class="caption">
            <b>${post.user.username}</b> ${post.caption || ""}
          </div>

          <!-- Comments -->
          <div class="comments">
            ${
              post.comments.map(c => `
                <p><b>${c.user?.username || "User"}:</b> ${c.text}</p>
              `).join("")
            }
          </div>

          <!-- Add Comment -->
          <div class="add-comment">
            <input
              type="text"
              id="comment-${post._id}"
              placeholder="Add a comment..."
            />
            <button onclick="addComment('${post._id}')">Post</button>
          </div>

        </div>
      `;
    });

  } catch (err) {
    console.error("Failed to load feed", err);
  }
}

/* =========================
   CREATE POST
========================= */
async function createPost() {
  const caption = document.getElementById("caption").value;
  const image = document.getElementById("image").value;
  const userId = localStorage.getItem("userId");

  if (!image) {
    alert("Image URL required");
    return;
  }

  await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userId,
      caption,
      image
    })
  });

  document.getElementById("caption").value = "";
  document.getElementById("image").value = "";

  loadFeed();
}

/* =========================
   LIKE POST
========================= */
async function likePost(postId) {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    alert("Login first");
    return;
  }

  await fetch(`${API_URL}/posts/like/${postId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ userId })
  });

  loadFeed();
}

/* =========================
   ADD COMMENT
========================= */
async function addComment(postId) {
  const text = document.getElementById(`comment-${postId}`).value;
  const userId = localStorage.getItem("userId");

  if (!text) return;

  await fetch(`${API_URL}/posts/comment/${postId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ userId, text })
  });

  loadFeed();
}

/* =========================
   AUTO LOAD
========================= */
document.addEventListener("DOMContentLoaded", loadFeed);
