const express = require("express");
const session = require("express-session");
const app = express();
const port = 3000;
const router = require("./routers");

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(
  session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: false,
  })
);

const users = [
  { id: 1, name: "Admin", email: "admin@mail.com", password: "123", role: "admin" },
  { id: 2, name: "Teacher", email: "teacher@mail.com", password: "123", role: "teacher" },
  { id: 3, name: "Student", email: "student@mail.com", password: "123", role: "student" },
];

app.use(router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});