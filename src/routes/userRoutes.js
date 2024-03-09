const express = require('express');
const router = new express.Router();
const {checkAuth, checkRoleUser , checkRoleAdmin} = require('../authentication/checkAuth');

const userController = require('../controllers/userController');

router.post('/signup', userController.createUser);
router.post('/login', userController.verifyUser);


// crud
router.get('/getAll', checkAuth, userController.getAllUsers)
router.get('/get/:userId', checkAuth,checkRoleUser, userController.getUserById)
router.patch('/get/:userId', checkAuth, userController.updateUserById)
router.delete('/get/:userId', checkAuth, checkRoleAdmin,userController.deleteUserById)
//
module.exports = router;
