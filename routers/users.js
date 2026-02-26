const Controller = require("../controllers/controller");

const router = require("express").Router();

//Router untuk halaman users
router.get("/", Controller.users);

// //Router untuk edit user
router.get("/:userId/edit", Controller.editUsersForm);
router.post("/:userId/edit", Controller.editUsers);

router.get("/:userId/delete", Controller.deleteUsers);

module.exports = router;
