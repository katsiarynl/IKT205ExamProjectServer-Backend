// function GETBlogs() {
//   fetch("http://10.0.0.9:5000/blogs")
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data);
//       return data;
//     })
//     .catch((error) => {
//       console.error(error);
//       // Handle any errors here
//     });
// }

const GETBlogs = fetch("http://10.0.0.9:5000/blogs");
GETBlogs.then((response) => {
  return response.json();
}).then((data) => {
  console.log(data);
});

export default GETBlogs;
