const router = require("express").Router();

const usersRoutes = require("./users");
const coursesRoutes = require("./courses");
const Controller = require("../controllers/controller");
const { isLoggedIn } = require("../middlewares/auth")

//Halaman Login
router.get("/", Controller.loginForm);

//Halaman Home
router.get("/home", Controller.home);

router.use(isLoggedIn)
router.use("/users", usersRoutes);
router.use("/courses", coursesRoutes);

module.exports = router;
