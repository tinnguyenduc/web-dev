const express = require("express");
const userModel = require("../models/userModel");
const router = express.Router();

router.get("/me", async (req, res) => {
  if (req.session.user) {
    const user = await userModel.findById(req.session.user._id, {
      password: 0,
    });

    if (!user) return res.status(500).json({ error: "user doesn't exist" });

    return res.status(200).json(user);
  }
});

module.exports = router;
