const User = require("../models/user.model.js");
const cloudinary = require("../lib/cloudinary");
const globalMessage = require("../../error/errors.messages");
// const { registerValidation } = require("../../validation");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
require("dotenv").config({ path: "../../.env" });
const { sign, verify } = require("jsonwebtoken");
const {
  sendForgotEmail,
  emailVerification,
  welcomeEmail,
} = require("../lib/emailService");
// const Joi = require("joi");

exports.getAllUsers = async function (req, res) {
  try {
    await User.getUsers((err, result) => {
      if (err) {
        res.status(400).json({
          code: 400,
          status: "Bad Request",
          err: err,
        });
      } else {
        res.status(200).json({
          code: 200,
          data: result,
          message: "List of Users",
        });
      }
    });
  } catch (err) {
    return res.status(400).json({
      code: 400,
      status: "Bad Request",
      err: err,
    });
  }
};

exports.deleteUserById = async function (req, res) {
  try {
    await User.deleteUser(req.params.userId, (err, data) => {
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
          message: "User is not found",
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

exports.getUserById = async function (req, res) {
  try {
    await User.getUserById(req.params.userId, (err, result) => {
      if (err) {
        return res.status(500).send({
          success: globalMessage.NotSuccess,
          code: globalMessage.ServerCode,
          status: globalMessage.SeverErrorMessage,
          message: err.message,
        });
      }
      if (result) {
        return res.status(200).json({
          success: globalMessage.Success,
          code: globalMessage.SuccessCode,
          status: globalMessage.SuccessStatus,
          data: result,
          message: "profile is received",
        });
      } else {
        return res.status(200).json({
          success: globalMessage.NotSuccess,
          code: globalMessage.SuccessCode,
          status: globalMessage.SuccessStatus,
          data: result,
          message: "Profile is not found",
        });
      }
    });
  } catch (err) {
    return res.status(400).json({
      code: 400,
      status: "BadRequest",
      err: err,
    });
  }
};

// const signupSchema = Joi.object({
//   email: Joi.string().email().required(),
//   password: Joi.string().min(4).max(20).required(),
// });

exports.createUser = async function (req, res) {
  console.log("data");
  const body = req.body;
  // const { error, value } = signupSchema.validate(req.body);
  // if (error) {
  //   console.log(error);
  //   return res.send("Invalid Details");
  // }
  const salt = genSaltSync(10);
  body.password = hashSync(body.password, salt);
  User.getUserByEmail(body.email, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Database connection error",
      });
    }
    console.log("data1");
    if (results) {   
      return res.status(200).json({
        success: 0, 
        message: "Email Exist",
      });
    }
    if (!results) {
      const addStream = {
        user_name: body.user_name,
        password: body.password,
        email: body.email,
        first_name: body.first_name,
        last_name: body.last_name,
        
      };
      
      User.addUser(addStream, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: 0,
            message: "Database connection error", 
          });
        }
        const tokenDetails = {
          id: results.id,
          email: results.email,
          first_name: results.first_name,
          last_name: results.last_name,
        };
        let jsonToken = sign({ result: tokenDetails }, process.env.SECRET_KEY, {
          expiresIn: "1d",
        });
        emailVerification(jsonToken, results);
        return res.status(200).json({
          success: 1,
          data: results,
        });
      });
    }
  });
};


exports.login = async function (req, res) {
    const body = req.body;
    let user_id;
    await User.getUserByEmail(body.email, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
        });
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Invalid Email",
        });
      }
  
      const result = compareSync(body.password, results.password);
      if (result) {
        if (
          results.isValid === "true" ||
          results.isValid === "True" ||
          results.isValid === "TRUE"
        ) {
          results.password = undefined;
          const jsonToken = sign({ result: results }, process.env.SECRET_KEY, {
            expiresIn: "30d",
          });
          return res.status(200).json({
            success: 1,
            message: "Login Sucessfully",
            user_id: `${results.id}`,
            token: jsonToken,
          });
        } else {
          return res.status(200).json({
            success: 0,
            message: `You cannot login to web app using this ${body.email} email. Please activate your account.`,
          });
        }
      } else {
        return res.json({
          success: 0,
          message: "Invalid Password",
        });
      }
    });
  };
  
  exports.resetPassword = async function (req, res) {
    let body = req.body;
    let user_id = req.params.user_id;
    await User.getUserById(user_id, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
        });
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Invalid User_id",
        });
      }
      const valid = compareSync(body.oldPassword, results.password);
      if (valid) {
        const pwcheck = compareSync(body.newPassword, results.password);
        const pw2check = compareSync(body.confirmPassword, results.password);
        if (body.newPassword == body.confirmPassword) {
          if (!pwcheck && !pw2check) {
            const salt = genSaltSync(10);
            let password = hashSync(body.newPassword, salt);
            const updateStream = {
              password: body.newPassword,
              hashed: password,
            };
            User.resetPassword(user_id, updateStream, (err, data) => {
              if (err)
                return res.status(500).send({
                  success: globalMessage.NotSuccess,
                  code: globalMessage.ServerCode,
                  status: globalMessage.notSuccessStatus,
                  message: err.message,
                });
              else {
                return res.status(200).json({
                  success: globalMessage.Success,
                  code: globalMessage.SuccessCode,
                  status: globalMessage.SuccessStatus,
                  data: data,
                });
              }
            });
          } else {
            return res.status(400).json({
              success: globalMessage.NotSuccess,
              code: globalMessage.UpdateError,
              status: globalMessage.notSuccessStatus,
              message: "This password is recently used, add another password.",
            });
          }
        } else {
          return res.status(400).json({
            success: globalMessage.NotSuccess,
            code: globalMessage.UpdateError,
            status: globalMessage.notSuccessStatus,
            message: "New pasword and Confirm password are mismatch.",
          });
        }
      } else {
        return res.status(400).json({
          success: globalMessage.NotSuccess,
          code: globalMessage.UpdateError,
          status: globalMessage.notSuccessStatus,
          message: "Old password not valid.",
        });
      }
    });
  };


  //////22222


  exports.updateUser = async function (req, res) {
    let user_id = req.params.id;
    let body = req.body;
    User.getUserById(user_id, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
        });
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Invalid User_id",
        });
      }
      if (results) {
        const updateStream = new User({
          user_name:body.user_name || results.user_name,
          password: results.password,
          email: body.email || results.email,
          first_name: body.first_name || results.first_name,
          last_name: body.last_name || results.last_name,
          
        });
        User.updateUser(user_id, updateStream, (err, data) => {
          if (err)
            return res.status(500).send({
              success: globalMessage.NotSuccess,
              code: globalMessage.ServerCode,
              status: globalMessage.notSuccessStatus,
              message: err.message,
            });
          else {
            return res.status(200).json({
              success: globalMessage.Success,
              code: globalMessage.SuccessCode,
              status: globalMessage.SuccessStatus,
              data: data,
            });
          }
        });
      }
    });
  };


  ////333


  exports.forgotPassword = async function (req, res) {
    let email = req.body.email;
    try {
      User.getUserByEmail(email, (err, result) => {
        if (err) {
          return res.status(500).send({
            success: globalMessage.NotSuccess,
            code: globalMessage.ServerCode,
            status: globalMessage.SeverErrorMessage,
            message: err.message,
          });
        }
        if (result) {
          const tokenDetails = {
            email: result.email,
            id: result.id,
            first_name: result.first_name,
            last_name: result.last_name,
          };
          let jsonToken = sign({ result: tokenDetails }, process.env.SECRET_KEY, {
            expiresIn: 600,
          });
          sendForgotEmail(jsonToken, result);
          return res.status(200).json({
            code: 200,
            success: true,
            data: "Please check your email to reset password.",
          });
        } else {
          return res.status(200).send({
            success: globalMessage.NotSuccess,
            code: globalMessage.NotFound,
            status: globalMessage.ItemNotFound,
            message: globalMessage.InvalidDataError,
          });
        }
      });
    } catch (err) {
      res
        .status(400)
        .json({ code: 500, success: false, message: "Internal Server Error" });
    }
  };
  
  exports.forgetPasswordEmail = async (req, res) => {
    const { newPassword, confirmPassword } = req.body;
    const id = req.params.id;
    let token = req.params.token;
    try {
      if (newPassword && confirmPassword && id && token) {
        if (newPassword === confirmPassword) {
          User.getUserById(id, (err, result) => {
            if (err) {
              return res.status(503).send({
                success: globalMessage.NotSuccess,
                code: globalMessage.ServerCode,
                status: globalMessage.SeverErrorMessage,
                message: err.message,
              });
            }
            if (result) {
              verify(token, process.env.SECRET_KEY, (err, decoded) => {
                if (err) {
                  res.status(407).json({
                    success: globalMessage.NotSuccess,
                    code: globalMessage.SuccessCode,
                    status: globalMessage.SuccessStatus,
                    message: "Token Expired",
                  });
                } else {
                  console.log("token veryfied");
                  const salt = genSaltSync(10);
                  let password = hashSync(newPassword, salt);
                  const updateStream = {
                    password: newPassword,
                    hashed: password,
                  };
                  User.resetPassword(id, updateStream, (err, data) => {
                    if (err)
                      return res.status(503).send({
                        success: globalMessage.NotSuccess,
                        code: globalMessage.ServerCode,
                        status: globalMessage.notSuccessStatus,
                        message: err.message,
                      });
                    else {
                      return res.status(200).json({
                        code: 200,
                        success: true,
                        data: "Password Changed Successfully",
                      });
                    }
                  });
                }
              });
            } else {
              return res.status(404).send({
                success: globalMessage.NotSuccess,
                code: globalMessage.SuccessCode,
                status: globalMessage.SuccessStatus,
                message: "User not found",
              });
            }
          });
        } else {
          return res.status(405).json({
            code: 200,
            success: false,
            data: "Password and Confirm Password are not same",
          });
        }
      } else {
        return res.status(405).json({
          code: 200,
          success: false,
          data: "Please enter all fields",
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ code: 500, success: false, message: "Internal Server Error" });
    }
  };

  /////44444

  exports.findEmail = async function (req, res) {
    try {
      let email = req.body.email;
      User.checkEmail(email, (err, result) => {
        if (err) {
          res.status(500).send({
            success: globalMessage.NotSuccess,
            code: globalMessage.ServerCode,
            status: globalMessage.notSuccessStatus,
            message: err.message,
          });
        }
        if (result.length) {
          return res.status(200).json({
            success: globalMessage.Success,
            code: globalMessage.SuccessCode,
            status: globalMessage.SuccessStatus,
            message: "Email Exists.",
          });
        } else {
          return res.status(200).json({
            success: globalMessage.Success,
            code: globalMessage.SuccessCode,
            status: globalMessage.ItemNotFound,
            message: "Email does not exists.",
          });
        }
      });
    } catch (e) {
      res
        .status(500)
        .json({ code: 500, success: false, message: "Internal Server Error" });
    }
  };


  ////555 


  exports.verifyAccount = async function (req, res) {
    try {
      let token = req.body.token;
      verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
          res.json({
            success: 0,
            message: "Invalid Token.",
          });
        } else {
          console.log("token veryfied");
          User.editValid(decoded.result.id, (err, result) => {
            if (err) {
              res.status(500).send({
                success: globalMessage.NotSuccess,
                code: globalMessage.ServerCode,
                status: globalMessage.notSuccessStatus,
                message: err.message,
              });
            }
            if (result) {
              //membership details
              User.getUserById(decoded.result.id, (err, data) => {
                if (err) {
                  res.status(500).send({
                    success: globalMessage.NotSuccess,
                    code: globalMessage.ServerCode,
                    status: globalMessage.notSuccessStatus,
                    message: err.message,
                  });
                }else{
                  res.redirect('google.com')
                }
                // if (data) {
                //   Membership.getMembershipById(
                //     data.membership_id,
                //     (err, member) => {
                //       if (err) {
                //         res.status(500).send({
                //           success: globalMessage.NotSuccess,
                //           code: globalMessage.ServerCode,
                //           status: globalMessage.notSuccessStatus,
                //           message: err.message,
                //         });
                //       }
                //       if (member.length) {
                //         //decoded.result.email
                //         welcomeEmail(decoded.result.email, member[0], data);
                //       }
                //     }
                //   );
                // }
              });
              return res.status(200).json({
                success: globalMessage.Success,
                code: globalMessage.SuccessCode,
                status: globalMessage.SuccessStatus,
                data: result,
                message: "Your Account sucessfully activated.",
              });
            } else {
              return res.status(200).json({
                success: globalMessage.NotSuccess,
                code: globalMessage.SuccessCode,
                status: globalMessage.SuccessStatus,
                message: "We are not found such an account.",
              });
            }
          });
        }
      });
    } catch (e) {
      return res.status(400).json({ status: 400, message: e.message });
    }
  };
  
  exports.sendEmail = async function (req, res) {
    try {
      let email = req.body.email;
      await User.getUserByEmail(email, (err, results) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Database connection error",
          });
        }
        if (!results) {
          return res.json({
            success: 0,
            message: "Invalid Email",
          });
        }
        if (results) {
          const tokenDetails = {
            id: results.id,
            email: results.email,
            first_name: results.first_name,
            last_name: results.last_name,
          };
          let jsonToken = sign({ result: tokenDetails }, process.env.SECRET_KEY, {
            expiresIn: "1d",
          });
          emailVerification(jsonToken, results);
          return res.status(200).send({
            success: globalMessage.Success,
            code: globalMessage.SuccessCode,
            status: globalMessage.SuccessStatus,
            message: `Email send to ${results.email}`,
          });
        }
      });
    } catch (e) {
      return res.status(400).json({ status: 400, message: e.message });
    }
  };
  
  exports.checkTokenValid = async function (req, res) {
    try {
      let token = req.body.token;
      verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
          res.status(200).json({
            success: 400,
            message: err.message,
          });
        } else {
          res.status(200).json({
            success: 200,
            message: "Valid Token.",
          });
        }
      });
    } catch (e) {
      return res.status(400).json({ status: 400, message: e.message });
    }
  };
  

