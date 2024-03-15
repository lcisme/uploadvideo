const express = require("express");
const router = new express.Router();
const { checkParams } = require("../dto/validateDTO");
const {
  checkAuth,
  validateParams,
  checkRoleUser,
  checkRoleAdmin,
} = require("../authentication/checkAuth");
const userController = require("../controllers/userController");
const {validate,validateUserSearch, validateUserById} = require("../controllers/validators/userValidator")
router.post("/signup", validateParams(validate), userController.createUser);
router.post("/login", userController.verifyUser);
router.post("/refresh-token", userController.refreshTokenHandler );


//logout
router.post("/logout",checkAuth, userController.logoutUser)

// crud
router.get(
  "/getAll",
  checkAuth,
  checkParams,
  checkRoleAdmin,
  (req, res, next) => {
    console.log(req.query);
    console.log(req.originalUrl);
    if (Object.keys(req.query).length === 0) {
      userController.getAllUsers(req, res, next);
      return;
    }
    validateParams(validateUserSearch)
    userController.searchByName(req, res, next);
    return
  }
);
router.get(
  "/get/:userId",
  checkAuth,
  validateParams(validateUserById),
  checkRoleUser,
  userController.getUserById
);
router.patch(
  "/get/:userId",
  checkAuth,
  validateParams(validateUserById),
  userController.updateUserById
);
router.delete(
  "/get/:userId",
  checkAuth,
  validateParams(validateUserById),
  checkRoleAdmin,
  userController.deleteUserById
);

router.use((req, res) => {
  res.status(404).json("Page not found");
});

module.exports = router;
