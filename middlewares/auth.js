const isLoggedIn = (req, res, next) => {
  console.log(req.session);
  if (!req.session.userId) {
    const error = "Please Login First";
    res.redirect(`/?error=${error}`);
  } else {
    next();
  }
};

// router.use((req, res, next) => {
//   console.log(req.session);
//   if (!req.session.userId) {
//     const error = "Please Login First";
//     res.redirect(`/?error=${error}`);
//   } else {
//     next();
//   }
// });

const isTeacher = (req, res, next) => {
  console.log(req.session);
  if (req.session.userId && req.session.role !== "Teacher") {
    const error = "You have no access";
    res.redirect(`/?error=${error}`);
  } else {
    next();
  }
};

// router.use((req, res, next) => {
//   console.log(req.session);
//   if (req.session.userId && req.session.role !== "Teacher") {
//     const error = "You have no access";
//     res.redirect(`/?error=${error}`);
//   } else {
//     next();
//   }
// });

module.exports = { isLoggedIn, isTeacher };
