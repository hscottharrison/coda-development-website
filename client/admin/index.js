import { supabase } from '../scripts/auth.js';
import { wrapper, container } from 'coda-ui'

async function signOut() {
  let { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error logging out:', error.message);
    return;
  }
}

function getSession() {
  const supabaseProjectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  const storageKey = `sb-${supabaseProjectId}-auth-token`;
  const sessionDataString = localStorage.getItem(storageKey);
  const sessionData = JSON.parse(sessionDataString || "null");
  return sessionData;
}

async function fetchCategories() {
  const response = await (await fetch('http://localhost:8080/categories')).json();
  return response
}


const token = getSession()?.access_token
if(!token) {
  window.location.href = '/login/';
}

const categories = await fetchCategories();
const categorySelect = document.querySelector('select');
categories.forEach(category => {
  const option = document.createElement('option');
  option.value = category.id;
  option.textContent = category.categoryname;
  categorySelect.appendChild(option);
});

async function submitForm(event) {
  event.preventDefault();
  const session = getSession();
  console.log(session);
  const title = document.querySelector('#title').value;
  const content = document.querySelector('#content').value;
  const categoryid = document.querySelector('#categories').value;
  const response = await fetch('http://localhost:8080/posts', {
    method: 'POST',
    body: JSON.stringify({
      posttitle: title,
      content,
      categoryid: Number(categoryid),
      userId: session.user.id
    })
  });
  if(response.status === 201) {
    alert('Post created successfully');
  } else {
    alert('There was an error creating the post');
  }
}

document.querySelector('form')?.addEventListener('submit', submitForm);
document.querySelector('#logout')?.addEventListener('click', signOut); 