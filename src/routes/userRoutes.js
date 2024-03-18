const express = require("express");
const router = new express.Router();
const {
  checkAuth,
  validateParams,
  can,
} = require("../authentication/checkAuth");
const userController = require("../controllers/userController");
const {
  validate,
  validateSearch,
  validateUserById,
} = require("../controllers/validators/userValidator");
const { ROLE } = require("../config/constant");

router.post("/signup", validateParams(validate), userController.createUser);
router.post("/login", validateParams(validate) ,userController.verifyUser);
router.post("/refresh-token", userController.refreshTokenHandler);
router.post("/logout", checkAuth, userController.logoutUser);

//logout

// crud
router.get(
  "/getAll",
  checkAuth,
  can(ROLE.ADMIN),
  validateParams(validateSearch),
  userController.searchByName
);

router.get(
  "/get/:userId",
  checkAuth,
  validateParams(validateUserById),
  can(ROLE.USER),
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
  can(ROLE.ADMIN),
  userController.deleteUserById
);

router.use((req, res) => {
  res.status(404).json("Page not found");
});

module.exports = router;
