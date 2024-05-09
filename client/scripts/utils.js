
export function createPostList(posts, wrapperClass, cb) {
  // ELEMENTS
  const postList = document.querySelector(`.${wrapperClass}`);

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
      cb(post);
    };

    postItem.appendChild(title);
    postItem.appendChild(date);
    postList.appendChild(postItem);
  });
}