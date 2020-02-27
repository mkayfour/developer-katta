const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const gravatar = require("gravatar");
const bcrpt = require("bcryptjs");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const config = require("config");

// @route POST api/users
// @desc Register user
// @access Public
router.post(
  "/",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please include a valid e-mail").isEmail(),
    check(
      "password",
      "Please enter a valid password of 6 or more characters"
    ).isLength({
      min: 7
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const { name, email, password } = req.body;

    try {
      // see if user exists
      let user = await User.findOne({
        email
      });

      if (user) {
        res.status(400).json({
          errors: [
            {
              msg: "user already exists"
            }
          ]
        });
      }

      // Get users gravatars
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm"
      });

      user = new User({
        name,
        email,
        avatar,
        password
      });

      // Encrypt password
      const salt = await bcrpt.genSalt(10);

      user.password = await bcrpt.hash(password, salt);

      await user.save();

      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id
        }
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 36000000 },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }

    // res.status(200).json({ msg: "User Route" });
  }
);

module.exports = router;
