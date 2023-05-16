const Admin = require("../models/admin.model");
const globalMessage = require("../../error/errors.messages");
const utils = require("../lib/lib");
const jsonwebtoken = require("jsonwebtoken");
const { AdminEmailVerification, AdminSendForgotEmail } = require("../lib/emailService");
const cloudinary = require("../lib/cloudinary");
// const {
//   adminLoginValidation,
//   adminRegisterValidation,
//   adminUpdateValidation,
//   forgotPasswordValidation,
// } = require("../validation");

exports.register = async function (req, res, next) {
 // const { error } = adminRegisterValidation(req.body);
  const result = await cloudinary.uploader.upload(
    req.file.path,
    { folder: "profilePic" },
    function (error, result) {
      console.log(result, error);
    }
  );

  // if (error)
  //   return res.status(200).json({
  //     success: globalMessage.notSuccessStatus,
  //     code: globalMessage.SuccessCode,
  //     status: globalMessage.BadMessage,
  //     message: error.details[0].message,
  //   });

  const saltHash = utils.genPassword(req.body.password);
  const salt = saltHash.salt;
  const hash = saltHash.hash;
  const email = req.body.email;

  const newAdmin = new Admin({
    admin_name: req.body.admin_name,
    email: req.body.email,
    profile_pic:result.secure_url,
    hash: hash,
    salt: salt,
  });
  try {
    if (!req.body) {
      res.status(400).json({
        success: globalMessage.NotSuccess,
        code: globalMessage.BadCode,
        status: globalMessage.BadMessage,
        message: "Content can not be empty!",
      });
    }
    Admin.findAdminName(req.body.admin_name, (err, data) => {
      if (data && data.length) {
        return res.status(200).json({
          code:200,
          success: false,
          message: ` ${req.body.admin_name}  is already exists`,
        });
      }else{
        Admin.findByEmail(email, (err, data) => {
          if (data && data.length) {
            return res.status(200).json({
              success: globalMessage.NotSuccess,
              code: globalMessage.SuccessCode,
              status: globalMessage.SuccessStatus,
              message: `${email} is already exists`,
            });
          } else {
            Admin.create(newAdmin, (err, data) => {
              if (err) {
                return res.status(500).send({
                  success: globalMessage.NotSuccess,
                  code: globalMessage.ServerCode,
                  status: globalMessage.SeverErrorMessage,
                  message: err.message,
                });
              } else {
                const tokenObject = utils.issueAdminJWT(data);
                if (AdminEmailVerification(tokenObject.token, data)) {
                  res.status(200).json({
                    code:200,
                    success: true,
                    message:
                      "successfully registered Admin, Please verify your email !",
                  });
                }
    
    
              }
            });
          }
          if (err) {
            return res.status(500).send({
              success: globalMessage.NotSuccess,
              code: globalMessage.ServerCode,
              status: globalMessage.SeverErrorMessage,
              message: err.message,
            });
          }
        });
      }
      //Error Handling
      if (err) {
        console.log("ERROR");
        return res.status(400).json({ status: 400, message: err });
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
};
exports.login = async function (req, res) {
  //   const { error } = adminLoginValidation(req.body);
  // if (error)
  //   return res.status(201).send({
  //     success: globalMessage.NotSuccess,
  //     message: error.details[0].message,
  //   });
  
    try {
      Admin.findOne(req.body.admin_name, (err, admin) => {
        if (err) {
            return res.status(500).send({
              success: globalMessage.NotSuccess,
              code: globalMessage.ServerCode,
              status: globalMessage.SeverErrorMessage,
              message: err.message,
            });
          }
        if (!admin) {
            return res.status(200).json({
                success: globalMessage.NotSuccess,
                code: globalMessage.SuccessCode,
                status: globalMessage.SuccessStatus,
                message: "Invalid admin_name or Email",
              });
        }
        console.log("is",admin)
        const isValid = utils.validPassword(
          req.body.password,
          admin.hash,
          admin.salt
        );
  
        if (isValid) {   
          console.log("this is",isValid)
          const tokenObject = utils.issueAdminJWT(admin);
          console.log("first",admin.is_verified)
          if (admin.is_verified === 1) {
            
           return res.status(200).json({
              success: globalMessage.Success,
              code: globalMessage.SuccessCode,
              status: globalMessage.SuccessStatus,
              message:"Login successfully.", 
              token: tokenObject.token,    
              expiresIn: tokenObject.expires,
              sub: tokenObject.sub,   
            });
          }else{
            return res.status(200).json({
              success: false,
              status: "AdminNotVerified",
              message: "Please verify your email",
            });
          }
            
        } else {         
           return res.status(200).json({
                success: globalMessage.NotSuccess,
                code: globalMessage.SuccessCode,
                status: globalMessage.InvalidPasswordError,
                message: "You entered the wrong password",
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
  //new
  exports.update = async function (req, res) {
    // const { error } = adminUpdateValidation(req.body);
    // if (error) return res.status(400).send({ message: error.details[0].message });
    try {
        Admin.getAdminById(req.params.id, async (err, data) => {
        if (err) {
          return res.status(400).json({
            success: false,
            code: 500,
            status: "not success",
            message: "error",
          });
        }
        if (data.length) {
          let result;
          if (req.file) {
            result = await cloudinary.uploader.upload(req.file.path, {});
          }
  
          const updatedAdmin = new Admin({
            admin_name: req.body.admin_name || data[0].admin_name,
            email: req.body.email || data[0].email,
            profile_pic: result?.secure_url || data[0].profile_pic,
          });
  
          Admin.updateById(req.params.id, updatedAdmin, (err, data) => {
            console.log(data);
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
                message:"Update Admin Profile"
              });
            }
          });
        } else {
          return res.status(200).json({
            success: true,
            code: 200,
            status: "success",
            message: "Admin is not found",
          });
        }
      });
    } catch (e) {
      return res.status(400).json({ status: 400, message: e.message });
    }
  };
  exports.deleteAdmin = async function (req, res) {
    try {
      Admin.deleteAdmin(req.params.id, (err, data) => {
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
            message: "Admin is not found",
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
  exports.getAllAdmin = async function (req, res) {
    try {
      Admin.getAllAdmin((err, data) => {
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
  exports.getAdminById = async function (req, res) {
    try {
      Admin.getAdminById(req.params.id, (err, data) => {
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
            message: "profile is received",
          });
        } else {
          return res.status(200).json({
            success: globalMessage.NotSuccess,
            code: globalMessage.SuccessCode,
            status: globalMessage.SuccessStatus,
            data: data,
            message: "Profile is not found",
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
  exports.forgotPassword = async function (req, res, next) {
    // const { error } = forgotPasswordValidation(req.body);
    // if (error) return res.status(200).send({ code:400,success: false,message: error.details[0].message });
    try {
      Admin.findByEmail(req.body.email, (err, user) => {
        if (err) {
          return res.status(500).send({
            success: globalMessage.NotSuccess,
            code: globalMessage.ServerCode,
            status: globalMessage.SeverErrorMessage,
            message: err.message,
          });
        }
        if (user.length) {
          const user1 = user[0];
          const token = utils.issueAdminJWT(user1);
          console.log(token.sub);
          AdminSendForgotEmail(token.token, user1);
          return res.status(200).json({
            code: 200,
            success: true,
            data: "Please check your email to reset password.",
          });
        } else {
          return res.status(200).json({
            success: globalMessage.NotSuccess,
            code: globalMessage.SuccessCode,
            status: globalMessage.SuccessStatus,
            data: user,
            message: "Admin profile is not found.",
          });
        }
      });
    } catch (error) {
      res
        .status(500)
        .json({ code: 500, success: false, message: "Internal Server Error" });
    }
  };
  exports.resetPassword = async function (req, res) {
    try {
      if (req.query.token) {
        const tokenParts = req.query.token.split(" ");
  
        if (
          tokenParts[0] === "Bearer" &&
          tokenParts[1].match(/\S+\.\S+\.\S+/) !== null
        ) {
          try {
            const verification = jsonwebtoken.verify(
              tokenParts[1],
              process.env.ACCESS_SECRET_TOKEN
            );
           
  
            Admin.findByEmail(verification.sub.email, (err, data) => {
              if (err) {
                return res.status(500).send({
                  success: false,
                  code: 500,
                  status: "not success",
                  message: "error",
                });
              }
              if (data.length) {
                console.log(data);
                const updateUser = data[0];
  
                const saltHash = utils.genPassword(req.body.password);
                const salt = saltHash.salt;
                const hash = saltHash.hash;
  
                const updating = {
                  salt: salt,
                  hash: hash,
                };
  
                Admin.ResetPasswordAdmin(updateUser.id, updating, (err, data) => {
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
                      user: data,
                      message: "Password reset successfully",
                    });
                    
                  }
                });
              } else {
                return res.status(200).send({
                  success: true,
                  code: 200,
                  status: "success",
                  data: data,
                  message: "Token is invalid. Please contact us for assistance",
                });
              }
            });
          } catch (err) {
            res.status(200).json({
              code: 200,
              success: false,
              status: "Unauthorized",
              msg: "You are not authorized to visit this route",
            });
          }
        } else {
          res.status(200).json({
            code: 200,
            success: false,
            status: "Unauthorized",
            msg: "You are not authorized to visit this route",
          });
        }
      } else {
        res.status(200).json({
          code: 200,
          success: false,
          status: "TokenError",
          msg: "You are not authorized to visit this route 3",
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ code: 500, success: false, message: "Internal Server Error" });
    }
  };
  exports.verifyAccount = async function (req, res) {
    try {
      if (req.query.token) {
        const tokenParts = req.query.token.split(" ");
  
        if (
          tokenParts[0] === "Bearer" &&
          tokenParts[1].match(/\S+\.\S+\.\S+/) !== null
        ) {
          try {
            const verification = jsonwebtoken.verify(
              tokenParts[1],
              process.env.ACCESS_SECRET_TOKEN
            );
  
            Admin.findOneAdmin(verification.sub.email, (err, data) => {
              if (err) {
                return res.status(500).send({
                  success: false,
                  code: 500,
                  status: "not success",
                  message: "error",
                });
              }
              
              if (data.length) {
                const updateUser = data[0];
                console.log("first", updateUser);
                console.log("first", updateUser.id);
  
                Admin.verifyUser(updateUser.id, (err, data) => {
                  if (err)
                    return res.status(500).send({
                      success: false,
                      code: 500,
                      status: "not success",
                      message: err.message,
                    });
                  else {
                   
                    // return res.status(200).json({
                    //   success: true,
                    //   code: 200,
                    //   status: "success",
                    //   user: data,
                    //   message: "Successfully Registered",
                    // });
                    res.redirect('https://darling-starburst-b84e1d.netlify.app/')
                  //  res.redirect('http://ec2-35-153-79-221.compute-1.amazonaws.com:8000/')
                  }
                });
              } else {
                return res.status(200).send({
                  success: true,
                  code: 200,
                  status: "success",
                  data: data,
                  message: "Token is invalid. Please contact us for assistance",
                });
              }
            });
          } catch (err) {
            res.status(200).json({
              code: 200,
              success: false,
              status: "Unauthorized",
              msg: "You are not authorized to visit this route",
            });
          }
        } else {
          res.status(200).json({
            code: 200,
            success: false,
            status: "Unauthorized",
            msg: "You are not authorized to visit this route",
          });
        }
      } else {
        res.status(200).json({
          code: 200,
          success: false,
          status: "TokenError",
          msg: "You are not authorized to visit this route 3",
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ code: 500, success: false, message: "Internal Server Error" });
    }
  }; 
  //new reset password
  exports.forgetPasswordEmail = async (req, res) => {
    const { newPassword, confirmPassword } = req.body;
    const { id, token } = req.params;
    const tokenParts = token.split(" ");
    console.log("tokenParts", tokenParts[1]);
  
    try {
      if (newPassword && confirmPassword && id && token) {
        if (newPassword === confirmPassword) {
  console.log("id", req.params);
          Admin.getAdminById(req.params.id, (err, result) => {
            console.log("result", result);
            if (err) {
              return res.status(500).send({
                success: globalMessage.NotSuccess,
                code: globalMessage.ServerCode,
                status: globalMessage.SeverErrorMessage,
                message: err.message,
              });
            }
            if (result.length) {
              const isUser = result[0];
              //token verification  process.env.ACCESS_TOKEN_SECRET
              const isValid = jsonwebtoken.verify(
                tokenParts[1],
                process.env.ACCESS_SECRET_TOKEN
                
              );
  
              if (isValid) {
                // password hashing
  
            
  
                const saltHash = utils.genPassword(newPassword);
                const salt = saltHash.salt;
                const hash = saltHash.hash;
  
  
                Admin.updatePassword(
                  isUser.id,
                  salt,
                  hash,
                  
                  (err, result) => {
                    if (err) {
                      return res.status(500).send({
                        success: globalMessage.NotSuccess,
                        code: globalMessage.ServerCode,
                        status: globalMessage.SeverErrorMessage,
                        message: err.message,
                      });
                    }
                    if (result.affectedRows === 1) {
                      return res.status(200).json({
                        code: 200,
                        success: true,
                        data: "Password Changed Successfully",
                      });
                    } else {
                      return res.status(200).send({
                        success: globalMessage.NotSuccess,
                        code: globalMessage.SuccessCode,
                        status: globalMessage.SuccessStatus,
                        message: "User is not found",
                      });
                    }
                  }
                );
              } else {
                return res.status(200).json({
                  code: 200,
                  success: false,
                  data: "Token is not valid",
                });
              }
            } else {
              return res.status(200).send({
                success: globalMessage.NotSuccess,
                code: globalMessage.SuccessCode,
                status: globalMessage.SuccessStatus,
                message: "User is not found",
              });
  
            }
          });
        } else {
          return res.status(200).json({
            code: 200,
            success: false,
            data: "Password and Confirm Password are not same",
          });
        }
      } else {
        return res.status(200).json({
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

  
