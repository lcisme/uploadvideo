const express = require('express');
const router = new express.Router();
const {checkAuth, checkUserRole} = require('../authentication/checkAuth');

const userController = require('../controllers/userController');

router.post('/signup', userController.createUser);
router.post('/login', userController.verifyUser);


// crud
router.get('/getAll', userController.getAllUsers)
router.get('/get/:userId', userController.getUserById)
router.patch('/get/:userId', checkAuth, userController.updateUserById)
router.delete('/get/:userId', checkAuth, checkUserRole,userController.deleteUserById)

module.exports = router;
