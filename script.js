import { supabase } from "./supabaseClient.js";

let CURRENT_USER = null;

/* CONTAINERS */
const signupContainer = document.getElementById("signupContainer");
const loginContainer = document.getElementById("loginContainer");
const homeContainer = document.getElementById("homeContainer");

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

const discordLoginSignup = document.getElementById("discordLoginSignup");
const discordLoginLogin = document.getElementById("discordLoginLogin");

/* HELPERS */
async function getUsername(userId, fallbackEmail) {
  const { data } = await supabase.from("app_users").select("username").eq("id", userId).single();
  return data?.username || fallbackEmail;
}

async function getUserServers(userId) {
  const { data } = await supabase.from("servers").select("*").eq("member_id", userId);
  return data || [];
}

/* SHOW HOME */
async function showHome(username, avatarUrl) {
  signupContainer.style.display = "none";
  loginContainer.style.display = "none";
  homeContainer.style.display = "flex";

  homeUsername.textContent = `Good afternoon, ${username} 👋`;
  profilePic.src = avatarUrl || "https://via.placeholder.com/100";

  const servers = await getUserServers(CURRENT_USER.id);
  homeServers.innerHTML = "";

  if (!servers.length) {
    homeServers.innerHTML = "<p>No servers yet.</p>";
    return;
  }

  servers.forEach(server => {
    const div = document.createElement("div");
    div.className = "server-card";
    div.innerHTML = `
      <div class="left">
        <img src="${server.icon || 'https://via.placeholder.com/50'}">
        <span>${server.name}</span>
      </div>
      <i class="fas fa-chevron-right"></i>
    `;
    homeServers.appendChild(div);
  });
}

/* NAVIGATION LOGIC */
profilePic.onclick = async () => {
  const username = await getUsername(CURRENT_USER.id, CURRENT_USER.email);
  showHome(username, profilePic.src);
};

/* SIGNUP */
registrationForm.addEventListener("submit", async e => {
  e.preventDefault();
  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { username } } });
  if (error) return alert(error.message);
  await supabase.from("app_users").insert({ id: data.user.id, username });
  CURRENT_USER = data.user;
  showHome(username);
});

/* LOGIN */
loginForm.addEventListener("submit", async e => {
  e.preventDefault();
  const { data, error } = await supabase.auth.signInWithPassword({ email: loginEmail.value, password: loginPassword.value });
  if (error) return alert(error.message);
  CURRENT_USER = data.user;
  const username = await getUsername(data.user.id, data.user.email);
  showHome(username);
});

/* DISCORD OAUTH */
async function handleDiscordOAuth() {
  await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: { scopes: "identify email guilds", redirectTo: window.location.origin }
  });
}
discordLoginSignup.onclick = handleDiscordOAuth;
discordLoginLogin.onclick = handleDiscordOAuth;

/* SESSION RESTORE */
supabase.auth.onAuthStateChange(async (event, session) => {
  if (session?.user) {
    CURRENT_USER = session.user;
    const username = await getUsername(session.user.id, session.user.email);
    showHome(username);
  }
});

(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    CURRENT_USER = session.user;
    const username = await getUsername(session.user.id, session.user.email);
    showHome(username);
  } else {
    signupContainer.style.display = "flex"; // default
  }
})();