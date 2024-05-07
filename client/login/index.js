import { supabase } from '../scripts/auth.js';

async function submitForm(event) {
  event.preventDefault();
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;
  const response = await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

function init() {
    console.log(supabase);
}

init();
document.querySelector('form')?.addEventListener('submit', submitForm);