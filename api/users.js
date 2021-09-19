const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { getAllUsers, getUserByUsername, createUser } = require("../db");

usersRouter.get("/", async (req, res) => {
  const users = await getAllUsers();

  res.send({
    users,
  });
});

usersRouter.post("/login", async (req, res, next) => {
  // console.log(req);
  // console.log(req.body);
  // res.end();
  const { username, password } = req.body;
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }

  try {
    const user = await getUserByUsername(username);

    if (user && user.password == password) {
      const token = jwt.sign(
        { username: user.username, id: user.id },
        process.env.JWT_SECRET
      );
      res.send([token]);
      // res.send({ message: "you're logged in!" });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// usersRouter.post("/login", async (req, res, next) => {
//   const { username, password } = req.body;

//   // request must have both
//   if (!username || !password) {
//     next({
//       name: "MissingCredentialsError",
//       message: "Please supply both a username and password",
//     });
//   }

//   try {
//     const user = await getUserByUsername(username);

//     if (user && user.password == password) {
//       const token = jwt.sign(
//         { username: user.username, id: user.id },
//         process.env.JWT_SECRET
//       );
//       // create token & return to user
//       res.send({ message: "you're logged in!", token: token });
//     } else {
//       next({
//         name: "IncorrectCredentialsError",
//         message: "Username or password is incorrect",
//       });
//     }
usersRouter.post("/register", async (req, res) => {
  const { username, password, name, location } = req.body;

  try {
    const _user = await getUserByUsername(username);

    if (_user) {
      next({
        name: "UserExistsError",
        message: "User already exists",
      });
    }
    const user = await CreateUser({
      username,
      password,
      name,
      location,
    });

    const token = await jwt.sign(
      {
        id: user.id,
        username,
      },
      JWT_SECRET,
      {
        expiresIn: "1w",
      }
    );

    res.send({
      message: "Thank you for signing up",
      token,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// });

module.exports = usersRouter;
