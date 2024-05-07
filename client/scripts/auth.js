import { createClient } from '@supabase/supabase-js';


export let supabase;

export function initSupabase() {
  const supabaseProjectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const supabaseUrl = `https://${supabaseProjectId}.supabase.co`
  const supabase = createClient(supabaseUrl, publicAnonKey);
  return supabase;
}

if (!supabase) {
  supabase = initSupabase();
}

supabase.auth.onAuthStateChange((event, session) => {
  console.log(session)
    if (event === "SIGNED_IN" && window.location.pathname !== '/admin/') {
      window.location.href = '/admin/';
    } else if (event === "SIGNED_OUT" && window.location.pathname !== '/login/') {
      window.location.href = '/login/';
    }
});
