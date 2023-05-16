
const cloudinary = require("../../api/lib/cloudinary");
const globalMessage = require("../../error/errors.messages");
const blogPost = require("../models/blogs.model");

exports.createBlog = async function (req, res, next){
    
    const [image1Result] = await Promise.all([
      cloudinary.uploader.upload(req.files.img[0].path, { folder: "blogs" }),
      
  ]);
   // if (error) return res.status(200).json({ code:400,message: error.details[0].message });
  
    const newBlogPost = new blogPost({
        blog_title: req.body.blog_title,
        blog_body: req.body.blog_body,
        img: image1Result.secure_url,
        
    })
    try {
      if (!req.body) {
          res.status(400).json({
            code: 400,
            from: "DB",
            status: "BadRequest",
            message: "Content can not be empty!",
          });
        }
        blogPost.create(newBlogPost, (err,data) =>{
          if(err){
              res.status(500).send({
                  success: globalMessage.NotSuccess,
                  code: globalMessage.ServerCode,
                  status: globalMessage.notSuccessStatus,
                  message: err.message,
              });  
          }else{
              return res.status(200).json({
                  success: globalMessage.Success, 
                  code: globalMessage.SuccessCode,
                  status: globalMessage.SuccessStatus,
                  data: data,
              });
          }
        })  

    } catch (e) {
      return res.status(400).json({ status: 400, message: e.message });
    }
}
//get post by id
exports.getPostById = async function (req, res) {
    try {
        blogPost.getDataById(req.params.id, (err, data) => {
        if (err) {
          return res.status(400).json({
            success: globalMessage.NotSuccess,
            code: globalMessage.BadCode,
            status: globalMessage.BadMessage,
            message: err.message,
          });
        }
        if (data.length) {
          return res.status(200).json({
            success: globalMessage.Success,
            code: globalMessage.SuccessCode,
            status: globalMessage.SuccessStatus,
            data: data,
            message: "Blog are received",
          });
        } else {
          return res.status(200).json({
            success: globalMessage.NotSuccess,
            code: globalMessage.SuccessCode,
            status: globalMessage.SuccessStatus,
            data: data,
            message: "Blog are not found",
          });
        }
      });
    } catch (err) {
      return res.status(400).json({
        success: globalMessage.NotSuccess,
        code: globalMessage.BadCode,
        status: globalMessage.BadMessage,
        message: err.message,
      });
    }
  }; 
//update blog
exports.updateBlog = async function (req,res){
    try {
        blogPost.getDataById(req.params.id, async (err,data) =>{
        if (err) {
            return res.status(400).json({
              success: false,
              code: 500,
              status: "not success",
              message: "error",
            });
          }
        if(data.length){
            
            
    const image1Promise = req.files?.img ? cloudinary.uploader.upload(req.files.img[0].path, {}) : Promise.resolve(null);

    const [image1Result] = await Promise.all([
        image1Promise,
        
         ]);
           const updateBlog = new blogPost({
            blog_title: req.body.blog_title || data[0].blog_title,
            blog_body: req.body.blog_body || data[0].blog_body,
            img: image1Result?.secure_url || data[0].img,
        
           })

           blogPost.Update(req.params.id, updateBlog, (err, data) =>{
            if (err)
            return res.status(500).send({
              success: false,
              code: 500,
              status: "not success",
              message: err.message,
            });
            else {
                return res.status(200).json({
                  success: true,
                  code: 200,
                  status: "success",
                  data: data,
                  message: "Blog are Updated Successfully",
                });
              }
           })
        }else{
            return res.status(200).json({
                success: true,
                code: 200,
                status: "success",
                message: "Blog not found",
              });
        }  
       }) 
    } catch (e) {
        return res.status(400).json({
            success: globalMessage.NotSuccess,
            code: globalMessage.BadCode,
            status: globalMessage.BadMessage,
            message: e.message,
          });
    }
} 
//delete blog
exports.deleteBlog = async function (req, res) {
    try {
        blogPost.delete(req.params.id, (err, data) => {
        if (err) {
          return res.status(500).send({
            success: globalMessage.NotSuccess,
            code: globalMessage.ServerCode,
            status: globalMessage.SeverErrorMessage,
            message: err.message,
          });
        }
        if (data.affectedRows === 1) {
          return res.status(200).json({
            success: globalMessage.Success,
            code: globalMessage.SuccessCode,
            status: globalMessage.SuccessStatus,
            message: "Successfully deleted",
          });
        } else {
          return res.status(200).send({
            success: globalMessage.NotSuccess,
            code: globalMessage.SuccessCode,
            status: globalMessage.SuccessStatus,
            message: "Blog are not found",
          });
        }
      });
    } catch (e) {
      return res.status(400).json({
        success: globalMessage.NotSuccess,
        code: globalMessage.BadCode,
        status: globalMessage.BadMessage,
        message: e.message,
      });
    }
  };

  //get All blogs

  exports.getAllBlogs = async function (req, res) {
    try {
      blogPost.getAll((err, data) => {
        if (err) {
          return res.status(500).send({
            success: globalMessage.NotSuccess,
            code: globalMessage.ServerCode,
            status: globalMessage.SeverErrorMessage,
            message: err.message,
          });
        }
        if (data.length) {
          return res.status(200).json({
            success: globalMessage.Success,
            code: globalMessage.SuccessCode,
            status: globalMessage.SuccessStatus,
            data: data,
            message: "List is received",
          });
        } else {
          return res.status(200).send({
            success: globalMessage.NotSuccess,
            code: globalMessage.SuccessCode,
            status: globalMessage.SuccessStatus,
            data: data,
            message: "List is empty",
          });
        }
      });
    } catch (e) {
      return res.status(400).json({
        success: globalMessage.NotSuccess,
        code: globalMessage.BadCode,
        status: globalMessage.BadMessage,
        message: e.message,
      });
    }
  };