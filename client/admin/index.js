import { supabase } from '../scripts/auth.js';

// FUNCTION DEFINITIONS
async function fetchCategories() {
  const response = await (await fetch('https://coda-development-blog-server-7608b8fd306e.herokuapp.com/categories')).json();
  return response
}

function getSession() {
  const supabaseProjectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  const storageKey = `sb-${supabaseProjectId}-auth-token`;
  const sessionDataString = localStorage.getItem(storageKey);
  const sessionData = JSON.parse(sessionDataString || "null");
  return sessionData;
}

async function getSetCategories() {
  const categories = await fetchCategories();
  const categorySelect = document.querySelector('select');
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.categoryName;
    categorySelect.appendChild(option);
  });
}

async function handleImageUpload(event) {
  const file = event.target.files[0];
  const { data, error } = await supabase.storage
    .from('blogimages')
    .upload(`public/${file.name}`, file);

  if (error) {
    console.error('Error uploading file:', error.message);
    return;
  }
  console.log({data, error})
  const supabaseProjectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  const supabaseUrl = `https://${supabaseProjectId}.supabase.co`
  const imageURL = `${supabaseUrl}/storage/v1/object/public/${data.fullPath}`;

  const imagePreview = document.querySelector('#image-preview');
  imagePreview.src = imageURL;
}

async function signOut() {
  let { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error logging out:', error.message);
    return;
  }
}

async function submitForm(event) {
  event.preventDefault();
  const session = getSession();
  const postTitle = document.querySelector('#title').value;
  const content = document.querySelector('#content').value;
  const categoryId = document.querySelector('#categories').value;
  const imageUrl = document.querySelector('#image-preview').src;
  const response = await fetch('https://coda-development-blog-server-7608b8fd306e.herokuapp.com/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': session.access_token
    },
    body: JSON.stringify({
      postTitle,
      content,
      categoryId: Number(categoryId),
      userId: session.user.id,
      imageUrl
    })
  });
  if(response.status === 201) {
    alert('Post created successfully');
  } else {
    alert('There was an error creating the post');
  }
}



function verifySession() {
  const token = getSession()?.access_token
  if(!token) {
    window.location.href = '/login/';
  }
}

async function init() {
  verifySession();
  getSetCategories();

  // ADD EVENT LISTENERS
  document.querySelector('form')?.addEventListener('submit', submitForm);
  document.querySelector('#logout')?.addEventListener('click', signOut); 
  document.querySelector('#image-upload').addEventListener('change', handleImageUpload);
}

// CALL STACK
await init();
