const routes = require("express").Router();


const blogPost = require("../../controllers/blogs.controller")
const storage = require("../../lib/multer");
const lib = require("../../lib/lib");



//individual comment
routes.post("/createBlog",storage.fields([
    {
        name: "img",
        maxCount: 1,  
    },   
]),blogPost.createBlog)
routes.put("/updateBlog/:id",storage.fields([
    {
        name: "img",
        maxCount: 1,  
    },
    
]),blogPost.updateBlog)
routes.get("/getBlogById/:id",blogPost.getPostById)
routes.get("/getBlogs",blogPost.getAllBlogs)
routes.delete("/deleteBlog/:id",blogPost.deleteBlog)

module.exports = routes;