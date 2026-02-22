import { supabase } from "../lib/supabaseClient.js";

export default function ExternalAuth() {
  const handleDiscord = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "discord",
        options: {
          redirectTo: "https://communityhubtestv1.netlify.app/auth/callback",
        },
      });

      if (error) throw error;
    } catch (err) {
      alert(`Discord login error: ${err.message}`);
    }
  };

  return (
    <button className="discord-btn" onClick={handleDiscord}>
      <i className="fab fa-discord"></i> Sign in with Discord
    </button>
  );
}
