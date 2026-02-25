const Controller = require("../controllers/controller");

const router = require("express").Router();

//Router untuk halaman users
router.get("/", Controller.users);

// //Router untuk edit user
router.get("/:id/edit", Controller.editUsersForm);
router.post("/:id/edit", Controller.editUsers);

router.get("/:id/delete", Controller.deleteUsers);

module.exports = router;
