const routes = require("express").Router();

//routes
const userRouter = require("../routes/user/user.routes.js");
const blogRouter = require("../routes/blogs/blogs.routes.js");
const adminRouter = require("../routes/admin/index.js")

//user
routes.use("/user", userRouter);
routes.use("/blogs", blogRouter);
routes.use("/admin",adminRouter)

module.exports = routes;  