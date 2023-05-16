const sql = require("../models/dbConnection")

const blogPost = function(data){
    this.blog_title = data.blog_title;
    this.blog_body = data.blog_body;
    this.img = data.img;
   
    
}
blogPost.create =(newBlogPost, result) => {
    sql.query("INSERT INTO blogs SET ?", newBlogPost, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, "");
          return;
        } else {
          result("", { id: res.insertId, ...newBlogPost });
        }
      });  
}

//delete post
blogPost.delete = (id, result) => {
    sql.query(`DELETE FROM blogs WHERE id ='${id}'`, (err, res) => {
      if (err) {
        result(err, "");
        return;
      }
      if (res) {
        result("", res);
        return;
      }
      result("", "");
    });
  };

  //getById
  blogPost.getDataById = (id, result) => {
    sql.query(`SELECT * FROM blogs WHERE id ='${id}'`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, "");
        return;
      }
  
      if (res) {
        result("", res);
        return;
      }
  
      result("", "");
      return;
    });
  };

  //update blogs
  blogPost.Update = (id, updateBlogs, result) => {
    sql.query(
      `UPDATE blogs
          SET
          blog_title='${updateBlogs.blog_title}',  
          blog_body='${updateBlogs.blog_body}',
          img='${updateBlogs.img}'
          WHERE id='${id}'`,
      (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, "");
            return;
          }
    
          if (res.affectedRows === 1) {
            result("", { id: id, ...updateBlogs });
            return;
          }
    
          result("", "");
          return;
      }
    );
  };


  //getAllBlogs
  blogPost.getAll = (result) => {
    sql.query("SELECT * FROM blogs", (err, res) => {
      if (err) {
        result(err, "");
        return;
      }
  
      if (res.length) {
        result("", res);
        return;
      }
      result("", "");
      return;
    });
  };
  module.exports = blogPost;     