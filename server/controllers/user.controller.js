const { User } = require("../models/user.model");
const bcrypt = require("bcrypt");

module.exports.registerUser = async (req, res, next) => {
  try {
    const { username, email, password, picture } = req.body;
    const checkUsername = await User.findOne({ username });
    if (checkUsername) {
      return res.status(400).json({ errors: { usernameExists: { message: "Username taken." } } });
    }
    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return res.status(400).json({ errors: { emailExists: { message: "Email taken." } } });
    }

    let hashedPassword = password;
    if (password.length >= 8) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const user = await new User({ username, email, password: hashedPassword, picture });

    user
      .save()
      .then((user) => {
        res.json(user);
      })
      .catch((error) => {
        console.log(error);
        return res.status(400).json(error);
      });

    delete user.password;
    // return res.json(user);
  } catch (ex) {
    // return res.status(400).json(err);
    next(ex);
  }
};

module.exports.loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ errors: { invalidLogin: { message: "Invalid Username Or Password." } } });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ errors: { invalidLogin: { message: "Invalid Username Or Password." } } });
    }

    return res.json(user);
  } catch (ex) {
    // return res.status(400).json(err);
    next(ex);
  }
};

module.exports.allUsers = (req, res) => {
  User.find({ username: { $exists: true } })
    .sort({ username: 1 })
    .then((p) => res.json(p))
    .catch((err) => res.json(err));
};
