import { supabase } from "./supabaseClient.js";

let CURRENT_USER = null;

/* ---------------- DOM REFERENCES (CRITICAL FIX) ---------------- */
const signupContainer = document.getElementById("signupContainer");
const loginContainer = document.getElementById("loginContainer");
const homeContainer = document.getElementById("homeContainer");
const dashboardContainer = document.getElementById("dashboardContainer");

const dashboardGreeting = document.getElementById("dashboardGreeting");
const dashboardProfilePic = document.getElementById("dashboardProfilePic");

const homeUsername = document.getElementById("homeUsername");
const profilePic = document.getElementById("profilePic");
const homeServers = document.getElementById("homeServers");

const registrationForm = document.getElementById("registrationForm");
const loginForm = document.getElementById("loginForm");

const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

const logoutBtn = document.getElementById("logoutBtn");
const backBtn = document.getElementById("backToDashboardBtn");

const discordLoginSignup = document.getElementById("discordLoginSignup");
const discordLoginLogin = document.getElementById("discordLoginLogin");


/* ---------------- HELPERS ---------------- */

// 🔥 ALWAYS fetch username from database (this fixes email bug)
async function getUsername(userId, fallbackEmail) {
  const { data } = await supabase
    .from("app_users")
    .select("username")
    .eq("id", userId)
    .single();

  return data?.username || fallbackEmail;
}

// 🔥 Fetch Discord servers stored in DB
async function getUserServers(userId) {
  const { data } = await supabase
    .from("servers")
    .select("*")
    .eq("member_id", userId);

  return data || [];
}


/* ---------------- UI SCREENS ---------------- */

async function showHome(username, avatarUrl) {
  signupContainer.style.display = "none";
  loginContainer.style.display = "none";
  dashboardContainer.style.display = "none";
  homeContainer.style.display = "flex";

  homeUsername.textContent = `Welcome, ${username}!`;
  profilePic.src = avatarUrl || "https://via.placeholder.com/100";

  // load servers
  const servers = await getUserServers(CURRENT_USER.id);
  homeServers.innerHTML = "";

  if (servers.length === 0) {
    homeServers.innerHTML = "<p>No servers yet.</p>";
    return;
  }

  servers.forEach(server => {
    const div = document.createElement("div");
    div.className = "server-card";
    div.innerHTML = `
      <img src="${server.icon || "https://via.placeholder.com/50"}">
      <span>${server.name}</span>`;
    homeServers.appendChild(div);
  });
}

function showDashboard(username, avatarUrl) {
  signupContainer.style.display = "none";
  loginContainer.style.display = "none";
  homeContainer.style.display = "none";
  dashboardContainer.style.display = "flex";

  dashboardGreeting.textContent = `Good afternoon, ${username} 👋`;
  dashboardProfilePic.src = avatarUrl || "https://via.placeholder.com/100";
}


/* ---------------- NAVIGATION ---------------- */

dashboardProfilePic.onclick = async () => {
  const username = await getUsername(CURRENT_USER.id, CURRENT_USER.email);
  showHome(username, dashboardProfilePic.src);
};

backBtn.onclick = async () => {
  const username = await getUsername(CURRENT_USER.id, CURRENT_USER.email);
  showDashboard(username, dashboardProfilePic.src);
};


/* ---------------- AUTH ---------------- */

// SIGNUP
registrationForm.addEventListener("submit", async e => {
  e.preventDefault();

  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } }
  });

  if (error) return alert(error.message);

  await supabase.from("app_users").insert({
    id: data.user.id,
    username
  });

  CURRENT_USER = data.user;
  showDashboard(username);
});

// LOGIN
loginForm.addEventListener("submit", async e => {
  e.preventDefault();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: loginEmail.value,
    password: loginPassword.value
  });

  if (error) return alert(error.message);

  CURRENT_USER = data.user;
  const username = await getUsername(data.user.id, data.user.email);
  showDashboard(username);
});

// LOGOUT
logoutBtn.onclick = async () => {
  await supabase.auth.signOut();
  homeContainer.style.display = "none";
  dashboardContainer.style.display = "none";
  signupContainer.style.display = "flex";
};


/* ---------------- DISCORD OAUTH ---------------- */

async function handleDiscordOAuth() {
  await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: {
      scopes: "identify email guilds",
      redirectTo: "https://community-hub-team.github.io/community-hub/"
    }
  });
}

discordLoginSignup.onclick = handleDiscordOAuth;
discordLoginLogin.onclick = handleDiscordOAuth;


/* ---------------- SESSION RESTORE ---------------- */

supabase.auth.onAuthStateChange(async (event, session) => {
  if (session?.user) {
    CURRENT_USER = session.user;
    const username = await getUsername(session.user.id, session.user.email);
    const avatarUrl = session.user.user_metadata?.avatar_url || null;
    showDashboard(username, avatarUrl);
  }
});

(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    CURRENT_USER = session.user;
    const username = await getUsername(session.user.id, session.user.email);
    const avatarUrl = session.user.user_metadata?.avatar_url || null;
    showDashboard(username, avatarUrl);
  }
})();