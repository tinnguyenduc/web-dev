const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const register = async (req, res) => {
  const { username, email, password } = req.body;

  // checkig for missing information
  if (!email || !password || !username) {
    return res.status(400).json({ error: "missing information" });
  } else {
    const hash = bcrypt.hashSync(password, 10); // hasing and salting our password

    // adding the new user
    try {
      const User = new userModel({
        email, // this is the equivalent of writing email: email
        username,
        password: hash,
      });

      const user = await User.save();
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
};

/**
 * Params: Email and Password
 * Check if the information is good (use bcrypt)
 * if it's good, send back the user
 *
 * N.B. we can add a session to express here
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "missing information" });
  } else {
    const user = await userModel.findOne({ email: email });

    if (!user) {
      return res.status(500).json({ message: "user doesn't exist" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(500).json({ message: "incorrect password" });
    }

    req.session.user = {
      _id: user._id,
    };

    const token = jwt.sign(
      { user: { id: user._id, email: user.email } },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({ data: { token } });
  }
};

const logout = async (req, res) => {
  if (req.session.user) {
    delete req.session;

    return res.status(200).json({ message: "Disconnected" });
  }

  return res.status(400).json({ message: "No session found" });
};

module.exports = {
  register,
  login,
  logout,
};
