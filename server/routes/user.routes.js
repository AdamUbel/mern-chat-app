const UserController = require("../controllers/user.controller");

module.exports = (app) => {
  app.get("/api/users", UserController.allUsers),
    app.post("/api/user", UserController.loginUser),
    app.post("/api/users", UserController.registerUser);
};
