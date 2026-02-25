const router = require("express").Router();

const usersRoutes = require("./users");
const coursesRoutes = require("./courses");
const Controller = require("../controllers/controller");
const { isLoggedIn, isTeacher } = require("../middlewares/auth");

//Halaman Login
router.get("/", Controller.loginForm);
router.post("/", Controller.login);

// //Router untuk tambah user
router.get("/register", Controller.userRegisterForm);
router.post("/register", Controller.userRegister);

router.use(isLoggedIn);

// Router untuk  logout
router.get("/logout", Controller.logout);

//Halaman Home
router.get("/home", Controller.home);

router.use("/users", usersRoutes);
router.use("/courses", coursesRoutes);

module.exports = router;
