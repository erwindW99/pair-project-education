const router = require("express").Router();

const usersRoutes = require("./users");
const coursesRoutes = require("./courses");
const Controller = require("../controllers/controller");

//Halaman Login
router.get("/", Controller.login);

//Halaman Home
router.get("/home", Controller.home);

router.use("/users", usersRoutes);
router.use("/courses", coursesRoutes);

module.exports = router;
