function DELETEBlog() {
  fetch("http://10.0.0.9:5000/blogs", {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // Handle the returned data here
    })
    .catch((error) => {
      console.error(error);
      // Handle any errors here
    });
}
export default DELETEBlog;
