const sql = require("../models/dbConnection");

const User = function (user) {
  this.user_name = user.user_name;
  this.password = user.password;
  this.email = user.email;
  this.first_name = user.first_name;
  this.last_name = user.last_name;
};

//Add User

User.addUser = (newUser, result) => {
    sql.query("INSERT INTO user SET ?", newUser, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, "");
        return;
      } else {
        result("", { id: res.insertId, ...newUser });
        return;
      }
    });
  };

  // get user by email
User.getUserByEmail = (email, callBack) => {
    sql.query(
      `select * from user where email= ?`,
      [email],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  };
  
  //get all users
  User.getUsers = (callBack) => {
    sql.query("select * from user", [], (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results);
    });
  };
  
  //get user by Id
  User.getUserById = (id, result) => {
    sql.query(`SELECT * FROM user WHERE id='${id}'`, (err, res) => {
      if (err) {
        result(err, "");
        return;
      }
  
      if (res.length) {
        result("", res[0]);
        return;
      }
      result("", "");
      return;
    });  
  };


  // delete user by id
User.deleteUser = (id, result) => {
    sql.query(`DELETE FROM user WHERE id ='${id}'`, (err, res) => {
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
  
  // reset password
  User.resetPassword = (user_id, updateStream, result) => {
    sql.query(
      `update user set password = '${updateStream.hashed}' where id = '${user_id}'`,
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, "");
          return;
        }
        if (res.affectedRows === 1) {
          result("", { id: user_id, ...updateStream });
          return;
        }
        result("", "");
        return;
      }
    );
  };
  
  //update user details
  User.updateUser = (user_id, updateStream, result) => {
    sql.query(
      `update user set user_name ='${updateStream.user_name}', password = '${updateStream.password}', email='${updateStream.email}', first_name = '${updateStream.first_name}', last_name = '${updateStream.last_name}''`,
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, "");
          return;
        }
        if (res.affectedRows === 1) {
          result("", { id: user_id, ...updateStream });
          return;
        }
        result("", "");
        return;
      }
    );
  };
  
  //check email 

  User.checkEmail = (email, result) => {
    sql.query(
      `select email from user where email like '${email}%'`,
      (err, res) => {
        if (err) {
          result("err", "");
          return;
        }
        if (res.length) {
          result("", res);
          return;
        }
        result("", "");
      }
    );
  };

  //edit validation
  User.editValid = (id, result) => {
    sql.query(
      `update user set isValid = 'true' where id = '${id}'`,
      (err, res) => {
        if (err) {
          result(err, "");
          return;
        }
        if (res.affectedRows == 1) {
          result("", { id: id, isValid: "true" });
          return;
        }
        result("", "");
        return;
      }
    );
  };

  module.exports = User;