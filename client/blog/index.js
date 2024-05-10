// VARIABLE DEFINITIONS
let currentBlog;
let posts;

// FUNCTION DEFINITIONS
function createPostList(posts) {
  // ELEMENTS
  const postList = document.querySelector('.blog-list-section');

  // CREATE POST LIST
  posts.forEach(post => {
    const postItem = document.createElement('div');
    postItem.classList.add('post-item');
    postItem.id = `blog-${post.id}`;
    const title = document.createElement('h3');
    title.innerHTML = post.postTitle;
    const date = document.createElement('p');
    date.innerHTML = new Date(post.createdAt).toLocaleDateString();

    postItem.onclick = () => {
      updateCurrentBlog(post);
    };

    postItem.appendChild(title);
    postItem.appendChild(date);
    postList.appendChild(postItem);
  });
}

async function getPosts() {
  return await(await fetch(`${import.meta.env.VITE_BLOG_SERVER_URL}/posts/false`)).json();
}

function updateActiveLink(post) {
  const postItems = document.querySelectorAll('.post-item');
  postItems.forEach(item => {
    item.classList.remove('active');
  });
  document.getElementById(`blog-${post.id}`).classList.add('active');
}

function updateCurrentBlog(post) {
  updateActiveLink(post);
  // ELEMENTS
  const title = document.getElementById('blog-title');
  const image = document.getElementById('blog-image');
  const content = document.getElementById('blog-content-wrapper');
  content.innerHTML = '';

  // UPDATE ELEMENTS
  title.innerHTML = post.postTitle;
  image.src = post.imageUrl;

  const paragraphs = post.content.split('\n');
  paragraphs.forEach(paragraph => {
    const p = document.createElement('p');
    p.innerHTML = paragraph;
    content.appendChild(p);
  });
}

async function Init() {
  const postsResponse = await getPosts();
  if (!postsResponse) {
    // Display Error page
    return;
  }

  posts = postsResponse;
  createPostList(posts);
  updateCurrentBlog(posts[0]);
}

// FUNCTION CALLS
await Init();