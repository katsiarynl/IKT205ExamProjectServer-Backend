function PUTBlog(id) {
  const data = {
    title: "kaaaaaaaaaaaaaaaaaaaaatet!",
    slug: "awesome-post",
    published: true,
    content: "HELLOL",
    tags: ["featured", "announcement"],
  };

  fetch("http://10.0.0.9:5000/blogs/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

export default PUTBlog;
