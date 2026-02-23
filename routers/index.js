const router = require("express").Router();

const usersRoutes = require("./users");
const coursesRoutes = require("./courses");
const Controller = require("../controllers/controller");

//Halaman default => LOGIN
router.get("/", Controller.login);

router.use("/users", usersRoutes);
router.use("/courses", coursesRoutes);

module.exports = router;
