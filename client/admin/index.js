import { createClient } from '@supabase/supabase-js';

function initSupabase() {
  const supabaseProjectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const supabaseUrl = `https://${supabaseProjectId}.supabase.co`
  const supabase = createClient(supabaseUrl, publicAnonKey);
  return supabase;
}

function checkLoginStatus(supabase) {
  supabase.auth.onAuthStateChange((event, session) => {
        console.log(event);
      if (event === "SIGNED_OUT") {
        window.location.href = '/login/';
        console.log(event);
      }
    });
}

async function init() {
  const supabase = initSupabase();
  checkLoginStatus(supabase);
}

async function signOut() {
  let { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error logging out:', error.message);
    return;
  } else {
    checkLoginStatus(supabase);
  }
}

await init();