import { supabase } from "./supabaseClient.js";

let CURRENT_USER = null; // store logged in user globally

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
document.getElementById("switchLoginLink").onclick = () => {
signupContainer.style.display = "none";
loginContainer.style.display = "flex";
};
document.getElementById("switchSignupLink").onclick = () => {
loginContainer.style.display = "none";
signupContainer.style.display = "flex";
};

// 🔥 FETCH USERNAME PROPERLY FROM TABLE
async function getUsername(userId, fallbackEmail) {
const { data } = await supabase
.from("app_users")
.select("username")
.eq("id", userId)
.single();

return data?.username || fallbackEmail;
}

// 🔥 FETCH USER SERVERS
async function getUserServers(userId) {
const { data } = await supabase
.from("servers")
.select("*")
.eq("member_id", userId);

return data || [];
}

// --- Show Home (profile page) ---
async function showHome(username, avatarUrl) {
signupContainer.style.display = "none";
loginContainer.style.display = "none";
dashboardContainer.style.display = "none";
homeContainer.style.display = "flex";

homeUsername.textContent = Welcome, ${username}!;
profilePic.src = avatarUrl || "https://via.placeholder.com/80";

// 🔥 load servers
const servers = await getUserServers(CURRENT_USER.id);

homeServers.innerHTML = "";
servers.forEach(server => {
const div = document.createElement("div");
div.className = "server-card";
div.innerHTML =    <img src="${server.icon || "https://via.placeholder.com/50"}">   <span>${server.name}</span>;
homeServers.appendChild(div);
});
}

// --- Show Dashboard ---
function showDashboard(username, avatarUrl) {
signupContainer.style.display = "none";
loginContainer.style.display = "none";
homeContainer.style.display = "none";
dashboardContainer.style.display = "flex";

dashboardGreeting.textContent = Good afternoon, ${username} 👋;
dashboardProfilePic.src = avatarUrl || "https://via.placeholder.com/80";
}

// 🔥 Dashboard → Profile click
dashboardProfilePic.addEventListener("click", async () => {
const username = await getUsername(CURRENT_USER.id, CURRENT_USER.email);
showHome(username, dashboardProfilePic.src);
});

// 🔥 BACK BUTTON (HOME → DASHBOARD)
document.getElementById("backToDashboardBtn").onclick = async () => {
const username = await getUsername(CURRENT_USER.id, CURRENT_USER.email);
showDashboard(username, dashboardProfilePic.src);
};

// --- Logout ---
logoutBtn.onclick = async () => {
await supabase.auth.signOut();
homeContainer.style.display = "none";
dashboardContainer.style.display = "none";
signupContainer.style.display = "flex";
};

// --- Signup ---
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

// --- Login ---
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

// --- Discord OAuth ---
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

// --- OAuth return + session restore ---
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