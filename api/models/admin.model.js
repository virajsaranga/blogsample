const sql = require("../models/dbConnection")

const Admin = function(admin){
    this.admin_name = admin.admin_name,
    this.email = admin.email,
    this.profile_pic = admin.profile_pic,
    this.salt = admin.salt,
    this.hash = admin.hash
}
Admin.findByEmail = (email,result) =>{
    sql.query(`SELECT * FROM admin WHERE email = '${email}'`,(err,res) =>{
        if(err){
            console.log('error',err)
            result(err, '')
            return
        }
        if(res.length){
            result('', res)
            return
        }
        result('', '')
        return
    })
}
Admin.create = (newAdmin, result) =>{
    sql.query('INSERT INTO admin SET ?', newAdmin, (err,res) =>{
        if(err){
            console.log("error", err)
            result(err, "")
            return
        }
        result("", {id:res.insertId, ...newAdmin})
    })
}
Admin.findOne = (admin_name, result) =>{
    sql.query(`SELECT * FROM admin WHERE admin_name = '${admin_name}' or email= '${admin_name}'`,(err,res) =>{
        if(err){
            console.log("error", err)
            result(err, "")
            return
        }
        if(res.length){
            result("", res[0])
            return
        }
        result("", "")
    })
}
Admin.updateById = (id, updateAdmin, result) =>{
    sql.query(`UPDATE admin SET admin_name = '${updateAdmin.admin_name}', email = '${updateAdmin.email}', profile_pic = '${updateAdmin.profile_pic}' WHERE id ='${id}'`,(err, res) =>{
        if(err){
            console.log("error:", err)
            result("", err)
            return
        }
        if(res.affectedRows === 1){
            result("", {id: id, ...updateAdmin})
            return
        }
        result("", "")
        return

    })
}
Admin.deleteAdmin = (id, result) =>{
    sql.query(`DELETE FROM admin WHERE id ='${id}'`, (err,res) =>{
        if(err){
            console.log("error:", err)
            result(err, "")
            return
        }
        if(res){
            result("", res)
            return
        }
        result("", "")
    })
}
Admin.getAllAdmin = (result) =>{
    sql.query(`SELECT * FROM admin`, (err, res) =>{
        if(err){
            result(err, "")
            return
        }
        if(res.length){
            result("", res)
            return
        }
        result("", "")
        return
    })
}
Admin.getAdminById = (id, result) =>{
    sql.query(`SELECT * FROM admin WHERE id = '${id}'`,(err,res) =>{
        if(err){
            console.log(err)
            result(err,"")
            return
        }
        if(res.length){
            result("", res)
            return
        }
        result("", "")
        return
    })
}
Admin.ResetPasswordAdmin = (id,updatedAdmin, result) => {
    sql.query(
      `UPDATE admin SET hash='${updatedAdmin.hash}' ,salt ='${updatedAdmin.salt}' WHERE id='${id}'`,
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, "");
          return;
        }
  
        if (res.affectedRows === 1) {
          result("", { id: id, ...updatedAdmin });
          return;
        }
  
        result("", "");
        return;
      }
    );
  };
  Admin.findOneAdmin = (email, result) => {
    sql.query(`SELECT * FROM admin WHERE email = '${email}'`, (err, res) => {
      if (err) {
        result(err, '');
        return;
      }
      if (res.length) {
        result('', res);
        return;
      }
      result('', '');
      return;
    });
  };
  Admin.findAdminName = (admin_name,result) =>{
    sql.query(`SELECT * FROM admin WHERE admin_name = '${admin_name}'`,(err,res) =>{
      if (err) {
        result(err, '');
        return;
      }
      if (res.length) {
        result('', res);
        return;
      }
      result('', '');
      return;
    })
  }
  Admin.verifyUser = (id, result) => {
    console.log("id", id)
    sql.query(
      `UPDATE admin SET is_verified=1 WHERE id='${id}'`,
      (err, res) => {
        if (err) {
          console.log('error: ', err);
          result(err, '');
          return;
        }
  
        if (res.affectedRows === 1) {
          result('', res);
          return;
        }
  
        result('', '');
        return;
      }
    );
  };
  Admin.updatePassword = (id, salt,hash, result) => {
    sql.query(
      `UPDATE admin SET salt='${salt}',hash='${hash}' WHERE id='${id}'`,
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, "");
          return;
        }
  
        if (res.affectedRows === 1) {
          result("", { id: id, salt: salt, hash: hash });
          return;
        }
  
        result("", "");
        return;
      }
    );
  };
  
  
module.exports = Admin;
