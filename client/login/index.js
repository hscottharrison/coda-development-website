import { supabase } from '../scripts/auth.js';

import { codaInput, codaButton } from 'coda-ui';

async function submitForm(event) {
  event.preventDefault();
  const email = document.querySelector('#email').input.value;
  const password = document.querySelector('#password').input.value;
  const response = await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

function init() {
    console.log(supabase);
}

init();
// document.querySelector('form')?.addEventListener('submit', submitForm);
document.querySelector('coda-button')?.addEventListener('click', submitForm);