const { Course, CourseUser, Material, User, UserProfile } = require("../models");


class Controller {
  static async loginPage(req, res) {
    try {
      res.render("login");
    } catch (error) {
      res.send(error);
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({
        where: { email, password },
      });

      if (!user) {
        return res.send("Email / Password salah");
      }

      req.session.user = {
        id: user.id,
        name: user.name,
        role: user.role,
      };

      res.redirect("/dashboard");
    } catch (err) {
      res.send(err);
    }
  }

  static async dashboard(req, res) {
    try {
      res.render("dashboard", { user: req.session.user });
    } catch (error) {
      res.send(error);
    }
  }

  static async logout(req, res) {
    req.session.destroy(() => {
      res.redirect("/login");
    });
  }
  
}

module.exports = Controller;
