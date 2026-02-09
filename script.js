import { supabase } from "./SupabaseClient.js";

const serverList = document.getElementById("serverList");

let serverChannel = null;

//////////////////////////////////////////////////
// AUTH STATE LISTENER (VERY IMPORTANT)
//////////////////////////////////////////////////
supabase.auth.onAuthStateChange((event, session) => {
  console.log("Auth event:", event);

  if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
    startApp();
  }

  if (event === "SIGNED_OUT") {
    serverList.innerHTML = "";
  }
});

//////////////////////////////////////////////////
// START APP AFTER LOGIN
//////////////////////////////////////////////////
async function startApp() {
  await loadServers();
  subscribeToServers();
}

//////////////////////////////////////////////////
// LOAD SERVERS FROM DATABASE
//////////////////////////////////////////////////
async function loadServers() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data, error } = await supabase
    .from("servers")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error loading servers:", error);
    return;
  }

  serverList.innerHTML = "";

  data.forEach(server => {
    const div = document.createElement("div");
    div.className = "server-item";
    div.textContent = server.name;
    serverList.appendChild(div);
  });
}

//////////////////////////////////////////////////
// REALTIME SUBSCRIPTION (PREVENTS DISAPPEARING)
//////////////////////////////////////////////////
function subscribeToServers() {
  if (serverChannel) return; // avoid duplicates

  serverChannel = supabase
    .channel("servers-channel")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "servers",
      },
      (payload) => {
        console.log("Realtime server update:", payload);
        loadServers();
      }
    )
    .subscribe();
}

//////////////////////////////////////////////////
// CREATE NEW SERVER
//////////////////////////////////////////////////
window.createServer = async function () {
  const name = prompt("Enter server name:");
  if (!name) return;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("servers")
    .insert([
      {
        name: name,
        user_id: user.id,
      }
    ]);

  if (error) {
    alert("Error creating server");
    console.error(error);
  }
};

//////////////////////////////////////////////////
// INITIAL CHECK IF USER ALREADY LOGGED IN
//////////////////////////////////////////////////
(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) startApp();
})();