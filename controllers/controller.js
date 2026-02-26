const { Op } = require("sequelize");
const {
  sequelize,
  User,
  UserProfile,
  Course,
  Material,
  CourseUser,
  MaterialUser,
} = require("../models/index");
const formattedCurrency = require("../helpers");
const bcrypt = require("bcryptjs");
class Controller {
  static async loginForm(req, res) {
    try {
      if (req.session.userId) {
        return res.redirect("/home");
      }

      const { error } = req.query;
      res.render("login", { error });
    } catch (error) {
      res.send(error);
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });

      if (user) {
        const isValidPassword = bcrypt.compareSync(password, user.password);

        if (isValidPassword) {
          req.session.userId = user.id;
          req.session.role = user.role;
          req.session.notif = `welcome back ${email} to this app`;

          return res.redirect("/home");
        } else {
          const error = "Invalid email or password";
          return res.redirect(`/?error=${error}`);
        }
      } else {
        const error = "Invalid email or password";
        return res.redirect(`/?error=${error}`);
      }
    } catch (error) {
      res.send(error);
    }
  }

  static async logout(req, res) {
    try {
      req.session.destroy();

      res.redirect("/");
    } catch (error) {
      res.send(error);
    }
  }

  static async users(req, res) {
    try {
      const { role } = req.session;
      let data = await User.findAll({
        include: UserProfile,
      });

      // res.send(data);
      res.render("users", { data, role });
    } catch (error) {
      res.send(error);
    }
  }

  static async userRegisterForm(req, res) {
    try {
      const { errors } = req.query;
      res.render("userRegisters", { errors });
    } catch (error) {
      res.send(error);
    }
  }

  static async userRegister(req, res) {
    const t = await sequelize.transaction();
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

      const user = await User.create(
        {
          email,
          password,
          role,
        },
        { transaction: t },
      );

      await UserProfile.create(
        {
          firstName,
          lastName,
          birthOfDate,
          phoneNumber,
          UserId: user.id,
        },
        { transaction: t },
      );

      await t.commit();
      res.redirect("/");
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        let errors = error.errors.map((el) => el.message);
        return res.redirect(`/register?errors=${errors}`);
      } else {
        console.log(error);
        res.send(error);
      }
    }
  }

  static async editUsersForm(req, res) {
    try {
      const { userId } = req.params;
      const { errors } = req.query;
      const { role } = req.session;

      let data = await User.findByPk(userId, {
        include: UserProfile,
      });

      res.render("editUsers", { data, errors, role });
    } catch (error) {
      res.send(error);
    }
  }

  static async editUsers(req, res) {
    const t = await sequelize.transaction();
    try {
      const { userId } = req.params;
      const {
        firstName,
        lastName,
        birthOfDate,
        email,
        phoneNumber,
        role,
        password,
      } = req.body;

      let user = await User.findByPk(userId, { transaction: t });

      let userUpdate = { email, role };

      if (password && password.trim() !== "") {
        userUpdate.password = password; // Model hook will handle hashing
      }

      await user.update(userUpdate, { transaction: t });

      let userProfile = await UserProfile.findOne({
        where: {
          UserId: userId, // typo fixed from previous: should be userId not id
        },
        transaction: t,
      });

      await userProfile.update(
        {
          firstName,
          lastName,
          birthOfDate,
          phoneNumber,
        },
        { transaction: t },
      );

      await t.commit();
      res.redirect("/users");
    } catch (error) {
      const { userId } = req.params;
      if (error.name === "SequelizeValidationError") {
        let errors = error.errors.map((el) => el.message);
        return res.redirect(`/users/${userId}/edit?errors=${errors}`);
      } else {
        console.log(error);
        res.send(error);
      }
    }
  }

  static async deleteUsers(req, res) {
    try {
      const { userId } = req.params;

      let user = await User.findByPk(userId);

      await user.destroy();

      res.redirect("/users");
    } catch (error) {
      res.send(error);
    }
  }

  static async home(req, res) {
    try {
      const { notif, userId, role } = req.session;
      const { search } = req.query;

      req.session.notif = null;

      // Mendapatkan Course yang User Ikuti
      let enrolledCourses = await Course.findAll({
        include: [
          {
            model: CourseUser,
            where: { UserId: userId },
            required: true,
          },
          {
            model: Material,
          },
        ],
        where: search ? { name: { [Op.iLike]: `%${search}%` } } : undefined,
      });

      // Menghitung Progress Setiap Course
      let chartLabels = [];
      let chartData = [];

      // Mencari Material yang Sudah Selesai per User (isFinished: true)
      for (let course of enrolledCourses) {
        chartLabels.push(course.name);

        const totalMaterials = course.Materials.length;

        let finishedCount = 0;

        if (totalMaterials > 0) {
          const materialIds = course.Materials.map((m) => m.id);

          finishedCount = await MaterialUser.count({
            where: {
              MaterialId: materialIds,
              UserId: userId,
              isFinished: true,
            },
          });

          const progress = Math.round((finishedCount / totalMaterials) * 100);
          chartData.push(progress);
        } else {
          chartData.push(0);
        }
      }

      // Kolom Search
      let data = await Course.search(search);

      //Cek Learn Course
      const learnCourseIds = await CourseUser.findAll({
        where: { UserId: req.session.userId },
        attributes: ["CourseId"],
      });
      const learnIds = learnCourseIds.map((el) => el.CourseId);

      res.render("home", {
        data,
        formattedCurrency,
        notif,
        search,
        chartLabels,
        chartData,
        role,
        learnIds,
      });
    } catch (error) {
      res.send(error);
    }
  }

  static async addCoursesForm(req, res) {
    try {
      const { errors } = req.query;
      const { role } = req.session;

      res.render("addCourses", { errors, role });
    } catch (error) {
      res.send(error);
    }
  }

  static async addCourses(req, res) {
    try {
      const { name, description, price, category } = req.body;

      await Course.create({ name, description, price, category });

      res.redirect("/home");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        let errors = error.errors.map((el) => el.message);
        return res.redirect(`/courses/add?errors=${errors}`);
      } else {
        console.log(error);
        res.send(error);
      }
    }
  }

  static async editCoursesForm(req, res) {
    try {
      const { courseId } = req.params;
      const { errors } = req.query;
      const { role } = req.session;

      let data = await Course.findByPk(courseId);

      res.render("editCourses", { data, errors, role });
    } catch (error) {
      res.send(error);
    }
  }

  static async editCourses(req, res) {
    try {
      const { courseId } = req.params;
      const { name, description, price, category } = req.body;

      let material = await Course.findByPk(courseId);

      await material.update({
        name,
        description,
        price,
        category,
      });
      // console.log(data);

      res.redirect(`/home`);
    } catch (error) {
      const { courseId } = req.params;
      if (error.name === "SequelizeValidationError") {
        let errors = error.errors.map((el) => el.message);
        return res.redirect(`/courses/${courseId}/edit?errors=${errors}`);
      } else {
        console.log(error);
        res.send(error);
      }
    }
  }

  static async courseMaterials(req, res) {
    try {
      const { courseId } = req.params;
      const { role } = req.session;

      let data = await Material.findAll({
        include: Course,
        where: {
          CourseId: courseId,
        },
      });

      let courseData = await Course.findByPk(courseId);

      // console.log(data);

      res.render("courseMaterials", { data, courseData, role });
    } catch (error) {
      res.send(error);
    }
  }

  static async learnCourse(req, res) {
    try {
      const { courseId } = req.params;
      const { userId } = req.session;

      await CourseUser.findOrCreate({
        where: {
          UserId: userId,
          CourseId: courseId,
        },
      });

      res.redirect("/home");
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async addMaterialsForm(req, res) {
    try {
      const { courseId } = req.params;
      const { role } = req.session;
      let data = await Course.findByPk(courseId);
      // console.log(data);

      res.render("addMaterials", { data, role });
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
      const { role } = req.session;

      let data = await Material.findByPk(materialId);
      // console.log(data);

      res.render("editMaterials", { data, role });
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

  static async finishMaterial(req, res) {
    try {
      const { courseId, materialId } = req.params;
      const { userId } = req.session;

      await MaterialUser.findOrCreate({
        where: {
          UserId: userId,
          MaterialId: materialId,
        },
        defaults: {
          isFinished: true,
        },
      });

      req.session.notif = "Material marked as finished!";
      res.redirect(`/courses/${courseId}/materials`);
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
}

module.exports = Controller;
