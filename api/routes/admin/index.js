const routes = require("express").Router();
const utils = require('../../lib/lib');
const storage = require("../../lib/multer");
var AdminController = require("../../controllers/admin");

routes.post("/register",storage.single('profile_pic') , AdminController.register);
routes.post("/login",AdminController.login)
routes.put("/update/:id",storage.single('profile_pic'),utils.adminAuthMiddleware, AdminController.update);
routes.delete("/delete/:id",utils.adminAuthMiddleware, AdminController.deleteAdmin);
routes.get('/getAllAdmin',utils.adminAuthMiddleware, AdminController.getAllAdmin);
routes.get('/getAdmin/:id',utils.adminAuthMiddleware, AdminController.getAdminById);
routes.post("/forgotpassword", AdminController.forgotPassword);
routes.post("/forget-password/:id/:token", AdminController.forgetPasswordEmail);
routes.put("/resetpassword", AdminController.resetPassword);
routes.get('/VerifyAccount', AdminController.verifyAccount);

module.exports = routes;