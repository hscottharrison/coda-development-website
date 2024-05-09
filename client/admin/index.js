import { supabase } from '../scripts/auth.js';
import { createPostList } from '../scripts/utils.js';

// VARIABLES
let currentPostId = null;

// ELEMENTS
const category = document.querySelector('#categories');
const content = document.querySelector('#content');
const deleteButton = document.querySelector('#delete-button');
const formTitle = document.querySelector('#form-title');
const imagePreview = document.querySelector('#image-preview');
const title = document.querySelector('#title');

// FUNCTION DEFINITIONS
function createNewPost() {
  formTitle.innerHTML = 'Create New Post';
  deleteButton.style.display = 'none';
  currentPostId = null;
  title.value = '';
  content.value = '';
  imagePreview.src = '';
  category.value = '';
}

async function deletePost(event) {
  event.preventDefault();
  if (!confirm("Are you sure you want to delete this post?")) return;
  const url = `${import.meta.env.VITE_BLOG_SERVER_URL}/posts/${currentPostId}`;
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Authorization': getSession().access_token
    }
  });

  if(response.status === 200) {
    alert('Post deleted successfully');
  } else {
    alert('There was an error deleting the post')
  }
  window.location.reload();
}

function editPost(post) {
  formTitle.innerHTML = `Edit Post: ${post.postTitle}`;
  deleteButton.style.display = 'flex';
  currentPostId = post.id;
  title.value = post.postTitle;
  content.value = post.content;
  imagePreview.src = post.imageUrl;
  category.value = post.categoryId;
}

async function fetchCategories() {
  const response = await (await fetch(`${import.meta.env.VITE_BLOG_SERVER_URL}/categories`)).json();
  return response
}

async function getPosts() {
  const response = await (await fetch(`${import.meta.env.VITE_BLOG_SERVER_URL}/posts`)).json();
  return response;
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

  const baseUrl = `${import.meta.env.VITE_BLOG_SERVER_URL}/posts`
  const url = currentPostId ? `${baseUrl}/${currentPostId}` : baseUrl;
  const method = currentPostId ? 'PUT' : 'POST';
  const response = await fetch(url, {
    method,
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
  if(response.status === 200) {
    alert(`Post ${method === 'POST' ? 'created' : 'edited'} successfully`);
  } else {
    alert(`There was an error ${method === 'Post' ? 'creating' : 'editing'} the post`);
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
  await getSetCategories();
  const posts = await getPosts();
  createPostList(posts, 'toggle-list-wrapper', editPost)


  // ADD EVENT LISTENERS
  document.querySelector('form')?.addEventListener('submit', submitForm);
  document.querySelector('#logout')?.addEventListener('click', signOut); 
  document.querySelector('#image-upload').addEventListener('change', handleImageUpload);
  document.querySelector('#new-post').addEventListener('click', createNewPost);
  document.querySelector('#delete-button').addEventListener('click', deletePost);
}

// CALL STACK
await init();
