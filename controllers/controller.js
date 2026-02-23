class Controller {
  static async login(req, res) {
    try {
      res.render("login");
    } catch (error) {
      res.send(error);
    }
  }
}

module.exports = Controller;
