import { createClient } from '@supabase/supabase-js';


function checkLoginStatus() {
  supabase.auth.onAuthStateChange((event, session) => {
    console.log(event);
      if (event === "SIGNED_IN") {
        window.location.href = '/admin/';
      }
    });
}

function initSupabase() {
  const supabaseProjectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const supabaseUrl = `https://${supabaseProjectId}.supabase.co`
  const supabase = createClient(supabaseUrl, publicAnonKey);
  return supabase;
}
async function init() {
  const categories = await (await fetch('http://localhost:8080/categories')).json();
  console.log("CATEGORIES: ", categories);

  checkLoginStatus();

}

async function submitForm(event) {
  event.preventDefault();
  console.log('form', event)
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;
  const response = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  console.log('RESPONSE', response);
}

const supabase = initSupabase();
await init();

document.querySelector('form').addEventListener('submit', submitForm); 