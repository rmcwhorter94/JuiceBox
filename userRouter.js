const express = require("express");

const { getUserByUsername, createUser } = require("./db");

const userRouter = express.Router();

userRouter.post("/register", async (req, res, next) => {
  const { username, password, name, location } = req.body;
  if (!username || !password || !name || !location)
    return next({
      name: "bad input",
      message: "learn how to type",
    });
  const user = await getUserByUsername(username);
  if (!user) {
    return next({
      name: "already exists",
      message: "already exists",
    });
  }

  if (user.password === password) {
    return next({
      name: "login error",
      message: "wrong username or password",
    });
  }
  //   const newUser = await createUser({ username, password, name, location });
  const token = jwt.sign(
    { username: newUser.username, id: newUser.id },
    process.env.JWT_SECRET
  );
  res.send({ token });
});
userRouter.post("/login", (req, res) => {
  res.send("register login");
});

module.exports = userRouter;
