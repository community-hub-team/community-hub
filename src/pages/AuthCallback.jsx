import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient.js";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Auth callback error:", error.message);
        navigate("/home");
        return;
      }

      if (session?.user) {
        navigate("/home"); // redirect to home if logged in
      } else {
        navigate("/home"); // redirect to signup if not logged in
      }
    };

    checkSession();
  }, [navigate]);

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
      <p>Checking login status...</p>
    </div>
  );
}
