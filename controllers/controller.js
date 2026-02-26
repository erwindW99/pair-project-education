const { User, UserProfile, Course, Material } = require("../models/index");
const bcrypt = require("bcryptjs")

class Controller {
  static async loginForm(req, res) {
    try {
      res.render("login");
    } catch (error) {
      res.send(error);
    }
  }

  static postLogin(req, res) {
      const { email, password } = req.body;

      User.findOne({ where: { email }})
      .then(user => {
        if (user) {
          const isValidPassword = bcrypt.compareSync(password, user.password)

          if (isValidPassword) {

            req.session.userId = user.id
            req.session.role = user.role
            return res.redirect("/")
          } else {
            const error = "invalid username/password"
            return res.redirect(`/login?error=${error}`)
          }
        } else {
            const error = "invalid username/password"
            return res.redirect(`/login?error=${error}`)
        }
      })
      .catch(err => res.send(err))
  }

  static getLogout(req, res) {
    req.session.destroy((err) => {
      if(err) res.send(err)
        else {
      res.redirect("/login")
      }     
    })
  }

  static async users(req, res) {
    try {
      let data = await User.findAll({
        include: UserProfile,
      });

      // res.send(data);
      res.render("users", { data });
    } catch (error) {
      res.send(error);
    }
  }

  static async userRegisterForm(req, res) {
    try {
      res.render("userRegisters");
    } catch (error) {
      res.send(error);
    }
  }

  static async userRegister(req, res) {
    try {
      const {
        firstName,
        lastName,
        birthOfDate,
        email,
        phoneNumber,
        role,
        password,
      } = req.body;

      let user = await User.create({
        email,
        password,
        role,
      });

      await UserProfile.create({
        firstName,
        lastName,
        birthOfDate,
        phoneNumber,
        UserId: user.id,
      });

      res.redirect("/users");
    } catch (error) {
      res.send(error);
    }
  }

  static async editUsersForm(req, res) {
    try {
      const { id } = req.params;

      let data = await User.findByPk(id, {
        include: UserProfile,
      });

      res.render("editUsers", { data });
    } catch (error) {
      res.send(error);
    }
  }

  static async editUsers(req, res) {
    try {
      const { id } = req.params;
      const {
        firstName,
        lastName,
        birthOfDate,
        email,
        phoneNumber,
        role,
        password,
      } = req.body;

      let user = await User.findByPk(id);

      await user.update({
        email,
        password,
        role,
      });

      let userProfile = await UserProfile.findOne({
        where: {
          UserId: id,
        },
      });

      await userProfile.update({
        firstName,
        lastName,
        birthOfDate,
        phoneNumber,
      });

      res.redirect("/users");
    } catch (error) {
      res.send(error);
    }
  }

  static async deleteUsers(req, res) {
    try {
      const { id } = req.params;

      let user = await User.findByPk(id);

      await user.destroy();

      res.redirect("/users");
    } catch (error) {
      res.send(error);
    }
  }

  static async home(req, res) {
    try {
      let data = await Course.findAll({
        include: Material,
      });
      // console.log(data);

      res.render("home", { data });
    } catch (error) {
      res.send(error);
    }
  }

  static async courseMaterials(req, res) {
    try {
      const { courseId } = req.params;

      let data = await Material.findAll({
        include: Course,
        where: {
          CourseId: courseId,
        },
      });
      let courseData = data[0].Course;

      // console.log(data);

      res.render("courseMaterials", { data, courseData });
    } catch (error) {
      res.send(error);
    }
  }

  static async addMaterialsForm(req, res) {
    try {
      const { courseId } = req.params;
      let data = await Material.findByPk(courseId);
      // console.log(data);

      res.render("addMaterials", { data });
    } catch (error) {
      res.send(error);
    }
  }

  static async addMaterials(req, res) {
    try {
      const { courseId } = req.params;
      const { name, fileUrl } = req.body;

      await Material.create({
        name,
        fileUrl,
        CourseId: courseId,
      });
      // console.log(data);

      res.redirect(`/courses/${courseId}/materials`);
    } catch (error) {
      res.send(error);
    }
  }

  static async editMaterialsForm(req, res) {
    try {
      const { materialId } = req.params;
      let data = await Material.findByPk(materialId);
      // console.log(data);

      res.render("editMaterials", { data });
    } catch (error) {
      res.send(error);
    }
  }

  static async editMaterials(req, res) {
    try {
      const { courseId, materialId } = req.params;
      const { name, fileUrl } = req.body;

      let material = await Material.findByPk(materialId);

      await material.update({
        name,
        fileUrl,
      });
      // console.log(data);

      res.redirect(`/courses/${courseId}/materials`);
    } catch (error) {
      res.send(error);
    }
  }

  static async deleteMaterials(req, res) {
    try {
      const { courseId, materialId } = req.params;

      let material = await Material.findByPk(materialId);

      await material.destroy();
      // console.log(data);

      res.redirect(`/courses/${courseId}/materials`);
    } catch (error) {
      res.send(error);
    }
  }
}

module.exports = Controller;
