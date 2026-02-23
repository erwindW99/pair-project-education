const router = require("express").Router();

const usersRoutes = require("./users");
const coursesRoutes = require("./courses");
const Controller = require("../controllers/controller");

//Halaman default => LOGIN
function isLoggedIn(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
}

router.get("/login", Controller.loginPage);
router.post("/login", Controller.login);
router.get("/dashboard", isLoggedIn, Controller.dashboard);
router.get("/logout", Controller.logout);

router.use("/users", usersRoutes);
router.use("/courses", coursesRoutes);

module.exports = router;
