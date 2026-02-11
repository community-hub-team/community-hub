import { supabase } from "./supabaseClient.js";

// --- Password toggles ---
function setupToggle(inputId, toggleId) {
  const input = document.getElementById(inputId);
  const toggle = document.getElementById(toggleId);
  toggle.addEventListener("click", () => {
    input.type = input.type === "password" ? "text" : "password";
    toggle.classList.toggle("fa-eye-slash");
  });
}
setupToggle("password", "togglePassword");
setupToggle("confirmPassword", "toggleConfirmPassword");
setupToggle("loginPassword", "toggleLoginPassword");

// --- Switch login/signup ---
document.getElementById("switchLoginLink").addEventListener("click", () => {
  document.getElementById("signupContainer").style.display = "none";
  document.getElementById("loginContainer").style.display = "flex";
});
document.getElementById("switchSignupLink").addEventListener("click", () => {
  document.getElementById("loginContainer").style.display = "none";
  document.getElementById("signupContainer").style.display = "flex";
});

// --- Show current homepage ---
function showHome(username, avatarUrl, servers = []) {
  document.getElementById("signupContainer").style.display = "none";
  document.getElementById("loginContainer").style.display = "none";
  document.getElementById("dashboardContainer").style.display = "none";

  const home = document.getElementById("homeContainer");
  home.style.display = "flex";

  document.getElementById("homeUsername").textContent = `Welcome, ${username}!`;
  document.getElementById("profilePic").src = avatarUrl || "https://via.placeholder.com/80";

  const container = document.getElementById("homeServers");
  container.innerHTML = "";
  servers.forEach(server => {
    const div = document.createElement("div");
    div.className = "server-card";
    div.innerHTML = `<img src="${server.icon || 'https://via.placeholder.com/50'}" alt="${server.name}" /><span>${server.name}</span>`;
    container.appendChild(div);
  });
}

// --- Show dashboard homepage ---
function showDashboard(username, avatarUrl) {
  document.getElementById("signupContainer").style.display = "none";
  document.getElementById("loginContainer").style.display = "none";
  document.getElementById("homeContainer").style.display = "none";

  const dash = document.getElementById("dashboardContainer");
  dash.style.display = "flex";

  document.getElementById("dashboardGreeting").textContent = `Good afternoon, ${username} 👋`;
  document.getElementById("dashboardProfilePic").src = avatarUrl || "https://via.placeholder.com/80";
}

// --- Switch to current homepage when clicking dashboard profile pic ---
document.getElementById("dashboardProfilePic").addEventListener("click", () => {
  const username = document.getElementById("dashboardGreeting").textContent.replace("Good afternoon, ", "").replace(" 👋", "");
  const avatar = document.getElementById("dashboardProfilePic").src;
  showHome(username, avatar);
});

// --- Logout ---
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await supabase.auth.signOut();
  document.getElementById("homeContainer").style.display = "none";
  document.getElementById("dashboardContainer").style.display = "none";
  document.getElementById("signupContainer").style.display = "flex";
});

// --- Delete account ---
document.getElementById("deleteAccountBtn").addEventListener("click", async () => {
  const userResp = await supabase.auth.getUser();
  const user = userResp.data.user;
  if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) return;

  const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(user.id);
  const { error: deleteTableError } = await supabase.from("app_users").delete().eq("id", user.id);
  if (deleteAuthError) console.error(deleteAuthError);
  if (deleteTableError) console.error(deleteTableError);

  document.getElementById("homeContainer").style.display = "none";
  document.getElementById("dashboardContainer").style.display = "none";
  document.getElementById("signupContainer").style.display = "flex";
});

// --- Signup ---
document.getElementById("registrationForm").addEventListener("submit", async e => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const messageDiv = document.getElementById("message");

  messageDiv.className = "";
  messageDiv.textContent = "";

  if (password !== confirmPassword) { messageDiv.textContent = "Passwords do not match!"; messageDiv.className = "error"; return; }
  if (username.length < 3) { messageDiv.textContent = "Username must be at least 3 characters long."; messageDiv.className = "error"; return; }

  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { username } } });
  if (error) { messageDiv.textContent = error.message; messageDiv.className = "error"; return; }

  const { error: insertError } = await supabase.from("app_users").insert({ id: data.user.id, username });
  if (insertError) console.error(insertError);

  messageDiv.textContent = `Registration successful! Welcome, ${username}!`;
  messageDiv.className = "success";

  setTimeout(() => showDashboard(username), 800);
});

// --- Login ---
document.getElementById("loginForm").addEventListener("submit", async e => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const messageDiv = document.getElementById("loginMessage");

  messageDiv.className = "";
  messageDiv.textContent = "";

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) { messageDiv.textContent = error.message; messageDiv.className = "error"; return; }

  const { data: userTableData } = await supabase.from("app_users").select("username").eq("id", data.user.id).single();
  const username = userTableData?.username || data.user.email;

  showDashboard(username);
});

// --- Discord OAuth ---
async function handleDiscordOAuth() {
  const { error } = await supabase.auth.signInWithOAuth({ provider: "discord", options: { scopes: "identify email guilds" } });
  if (error) console.error(error);
}

document.getElementById("discordLoginSignup").addEventListener("click", handleDiscordOAuth);
document.getElementById("discordLoginLogin").addEventListener("click", handleDiscordOAuth);

// --- Auth state change & session persistence ---
supabase.auth.onAuthStateChange(async (event, session) => {
  if (session?.user) {
    const user = session.user;
    const username = user.user_metadata?.username || user.user_metadata?.full_name || user.email;
    const avatarUrl = user.user_metadata?.avatar_url || null;
    showDashboard(username, avatarUrl);
  }
});

(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    const user = session.user;
    const { data: userTableData } = await supabase.from("app_users").select("username").eq("id", user.id).single();
    const username = userTableData?.username || user.user_metadata?.username || user.email;
    const avatarUrl = user.user_metadata?.avatar_url || null;
    showDashboard(username, avatarUrl);
  }
})();
