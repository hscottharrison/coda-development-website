async function getPosts() {
  const posts = await(await fetch('http://localhost:8080/posts')).json();
  console.log(posts);
}

await getPosts();