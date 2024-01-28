const express= require("express");
const {loginController , logout,regController, fetchAllUsersController,picupload, updateusr, searchUser, online} = require("../controller/userController");
const { protect } = require("../middleware/authmiddleware");
const router = express.Router();

router.post('/login' , loginController);
router.post('/register' , regController);
router.get('/fetchUsers' ,protect, fetchAllUsersController);
router.post('/picupload' ,protect, picupload);
router.put('/updatepic' ,protect, updateusr);
router.get('/searchuser' ,protect, searchUser);
router.get('/online' ,protect, online);
router.post('/logout' ,protect, logout);



module.exports = router;