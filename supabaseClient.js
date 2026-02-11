// supabaseClient.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://zoylgjygovjndxwuqqlu.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpveWxnanlnb3ZqbmR4d3VxcWx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzNTA4MTUsImV4cCI6MjA4NTkyNjgxNX0.6gKhXAtwbvXNzBcZvQEok2dLPH9yrVh5A7OKy53c5tU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
