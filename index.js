// const mongoose = require("mongoose");

// //https://github.com/arpanneupane19/Node-MongoDB-Connection/blob/main/server.js
// // https://mongoosejs.com/docs/

// const uri =
//   "mongodb+srv://katsiarynl:6tZbx2OTW99ex9fd@cluster0.83jtahe.mongodb.net/?retryWrites=true&w=majority";

// async function connect() {
//   try {
//     await mongoose.connect(uri);
//     console.log("Connected to MongoDB");
//   } catch (error) {
//     console.error(error);
//   }
// }

// connect();
const mongoose = require("mongoose");

const { Schema, model } = mongoose;

mongoose.connect(
  "mongodb+srv://katsiarynl:6tZbx2OTW99ex9fd@cluster0.83jtahe.mongodb.net/?retryWrites=true&w=majority"
);
const blogSchema = new Schema({
  title: String,
  slug: String,
  published: Boolean,
  author: String,
  content: String,
  tags: [String],
  createdAt: Date,
  updatedAt: Date,
  comments: [
    {
      user: String,
      content: String,
      votes: Number,
    },
  ],
});

const Blog = model("Blog", blogSchema);

const article = new Blog({
  title: "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkaaaaaaaaate!",
  slug: "awesome-post",
  published: true,
  content: "This is the best hey eveeeeeeeeeeeeeeeeeeeeeeeeeeeeeeer",
  tags: ["featured", "announcement"],
});

// Insert the article in our MongoDB database
article.save();
console.log("article");
// async function findarticle() {
//   const findarticle = await Blog.findById("64035b413684ea4a99fd4fc8").exec();
//   console.log(findarticle);
// }
// //findarticle();

// async function deleteEntry(id) {
//   const blog = await Blog.findByIdAndDelete(id).exec();
//   console.log(blog);
//   blog ? console.log("deleted") : console.log("not deleted");
// }

// //deleteEntry("640361d23926776c801cc029");

// async function updateEntry(id) {
//   const newarticle = await Blog.findById(id).exec();
//   article.title = "Updated Title Trial 2 yayyyeeeeeeeeeeeeeeeeeeyyyyyy";
//   await article.save();
//   console.log(newarticle);
// }

// updateEntry("6403621499ef5a6cf8fa5172");

// 6tZbx2OTW99ex9fd

// export default Blog;
