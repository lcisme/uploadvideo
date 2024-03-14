const express = require("express");
const router = new express.Router();
const { checkParams } = require("../dto/validateDTO");
const {
  checkAuth,
  checkRoleUser,
  checkRoleAdmin,
} = require("../authentication/checkAuth");
const userController = require("../controllers/userController");

router.post("/signup", userController.createUser);
router.post("/login", userController.verifyUser);
router.post("/refresh-token", userController.refreshTokenHandler );


//logout
router.post("/logout",checkAuth, userController.logoutUser)

// crud
// router.get(
//   "/getAll",
//   checkAuth,
//   checkParams,
//   checkRoleAdmin,
//   (req, res, next) => {
//     console.log(req.query);
//     if (Object.keys(req.query).length === 0) {
//       userController.getAllUsers(req, res, next);
//       return;
//     }
//     userController.searchByName(req, res, next);
//   }
// );
router.get(
  "/getAll",
  checkAuth,
  checkParams,
  checkRoleAdmin,
  (req, res, next) => {
    console.log(req.query);
    if (Object.keys(req.query).length === 0) {
      userController.getAllUsers(req, res, next);
      return;
    }
    userController.searchByName(req, res, next);
  }
);
router.get(
  "/get/:userId",
  checkAuth,
  checkParams,
  checkRoleUser,
  userController.getUserById
);
router.patch(
  "/get/:userId",
  checkAuth,
  checkParams,
  userController.updateUserById
);
router.delete(
  "/get/:userId",
  checkAuth,
  checkParams,
  checkRoleAdmin,
  userController.deleteUserById
);

router.use((req, res) => {
  res.status(404).json("Page not found");
});

module.exports = router;
