const routes = require("express").Router();
const userController = require("../../controllers/user.controller");
const { checkToken } = require("../../../auth/token/tokenValidation");

routes.get("/getAllUsers", checkToken, userController.getAllUsers);
routes.delete("/deleteUser/:userId", checkToken, userController.deleteUserById);
routes.get("/getUserById/:userId", checkToken, userController.getUserById);
routes.post("/createUser", userController.createUser);
routes.post("/userLogin", userController.login);
routes.put("/resetPassword/:user_id", checkToken, userController.resetPassword);
routes.put("/updateUser/:id", checkToken, userController.updateUser);
routes.post("/forgotPassword", userController.forgotPassword);
routes.post("/forget-password/:id/:token", userController.forgetPasswordEmail);
routes.post("/checkEmail", userController.findEmail);
routes.post("/verifyAccount", userController.verifyAccount);
routes.post("/getEmail", userController.sendEmail);
routes.post("/checkTokenValid", userController.checkTokenValid); 

module.exports = routes; 
