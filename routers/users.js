const Controller = require("../controllers/controller");

const router = require("express").Router();

//Router untuk halaman users
router.get("/", Controller.users);

// //Router untuk tambah user
router.get("/register", Controller.userRegisterForm);
router.post("/register", Controller.userRegister);

// //Router untuk edit user
router.get("/:id/edit", Controller.editUsersForm);
router.post("/:id/edit", Controller.editUsers);

router.get("/:id/delete", Controller.deleteUsers);

module.exports = router;
