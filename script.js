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


// --- Show Home ---
function showHome(username, avatarUrl, servers = []) {
  document.getElementById("signupContainer").style.display = "none";
  document.getElementById("loginContainer").style.display = "none";
  document.getElementById("dashboardContainer").style.display = "none";

  const home = document.getElementById("homeContainer");
  home.style.display = "flex";

  document.getElementById("homeUsername").textContent = `Welcome, ${username}!`;
  document.getElementById("profilePic").src =
    avatarUrl || "https://via.placeholder.com/80";

  const container = document.getElementById("homeServers");
  container.innerHTML = "";

  servers.forEach(server => {
    const div = document.createElement("div");
    div.className = "server-card";
    div.innerHTML = `
      <img src="${server.icon || "https://via.placeholder.com/50"}">
      <span>${server.name}</span>`;
    container.appendChild(div);
  });
}


// --- Show Dashboard ---
function showDashboard(username, avatarUrl) {
  document.getElementById("signupContainer").style.display = "none";
  document.getElementById("loginContainer").style.display = "none";
  document.getElementById("homeContainer").style.display = "none";

  const dash = document.getElementById("dashboardContainer");
  dash.style.display = "flex";

  document.getElementById("dashboardGreeting").textContent =
    `Good afternoon, ${username} 👋`;
  document.getElementById("dashboardProfilePic").src =
    avatarUrl || "https://via.placeholder.com/80";
}


// --- Switch dashboard → home ---
document.getElementById("dashboardProfilePic").addEventListener("click", () => {
  const username = document.getElementById("dashboardGreeting")
    .textContent.replace("Good afternoon, ", "")
    .replace(" 👋", "");
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


// --- Signup ---
document.getElementById("registrationForm").addEventListener("submit", async e => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const messageDiv = document.getElementById("message");

  messageDiv.textContent = "";

  if (password !== confirmPassword) {
    messageDiv.textContent = "Passwords do not match!";
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } }
  });

  if (error) {
    messageDiv.textContent = error.message;
    return;
  }

  await supabase.from("app_users").insert({
    id: data.user.id,
    username
  });

  showDashboard(username);
});


// --- Login ---
document.getElementById("loginForm").addEventListener("submit", async e => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    document.getElementById("loginMessage").textContent = error.message;
    return;
  }

  const { data: userTableData } = await supabase
    .from("app_users")
    .select("username")
    .eq("id", data.user.id)
    .single();

  const username = userTableData?.username || data.user.email;
  showDashboard(username);
});


// 🚨🚨🚨 DISCORD OAUTH FIX (THE IMPORTANT PART) 🚨🚨🚨
async function handleDiscordOAuth() {
  const redirectUrl =
    "https://community-hub-team.github.io/community-hub/";

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: {
      scopes: "identify email guilds",
      redirectTo: redirectUrl
    }
  });

  if (error) console.error(error);
}

document.getElementById("discordLoginSignup")
  .addEventListener("click", handleDiscordOAuth);

document.getElementById("discordLoginLogin")
  .addEventListener("click", handleDiscordOAuth);


// --- Handle OAuth return session ---
supabase.auth.onAuthStateChange((event, session) => {
  if (event === "SIGNED_IN" && session?.user) {
    const user = session.user;
    const username =
      user.user_metadata?.username ||
      user.user_metadata?.full_name ||
      user.email;
    const avatarUrl = user.user_metadata?.avatar_url || null;

    showDashboard(username, avatarUrl);
  }
});


// --- Restore session on refresh ---
(async () => {
  const { data: { session } } = await supabase.auth.getSession();

  if (session?.user) {
    const user = session.user;

    const { data: userTableData } = await supabase
      .from("app_users")
      .select("username")
      .eq("id", user.id)
      .single();

    const username =
      userTableData?.username ||
      user.user_metadata?.username ||
      user.email;

    const avatarUrl = user.user_metadata?.avatar_url || null;

    showDashboard(username, avatarUrl);
  }
})();