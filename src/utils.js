export const getData = () =>
  fetch("https://jsonplaceholder.typicode.com/posts").then((res) => res.json());
