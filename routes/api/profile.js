const express = require("express");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const request = require("request");
const config = require("config");
const router = express.Router();

const Profile = require("../../models/Profile");

const User = require("../../models/User");

// @route GET api/profile/me
// @desc get profile of logged in user
// @access Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({ msg: "No profile for this user" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});

// @route POST api/profile
// @desc Create or update a user profile
// @access Private
router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required.")
        .not()
        .isEmpty(),
      check("skills", "Skills are required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log("there is an error", errors);
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    // build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;

    if (skills) {
      profileFields.skills = skills.split(",").map(skill => skill.trim());
    }

    // Build social array
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        console.log("profile already exist");

        // update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      // create new
      console.log("profile doesnt exist");
      prof = new Profile(profileFields);
      const rep = await prof.save();
      console.log("result", rep);

      return res.json({ fields: rep });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  }
);

// @route Get api/profile
// @desc Get all profiles
// @access Public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});

// @route Get api/profile/user/:user_id
// @desc Get profile by user id
// @access Public
router.get("/user/:user_id", async (req, res) => {
  try {
    const profiles = await Profile.findOne({
      user: req.params.user_id
    }).populate("user", ["name", "avatar"]);

    if (!profiles) {
      return res.status(400).json({ mgs: "No profile for this user." });
    }

    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    // check if object id is present
    if (err.kind == "ObjectId") {
      return res.status(400).json({ mgs: "No profile for this user." });
    }
    return res.status(500).send("Server Error");
  }
});

// @route DELETE api/profile
// @desc Delete Profile user and posts
// @access Private
router.delete("/", auth, async (req, res) => {
  console.log("req.user.id", req.user.id);
  try {
    // @todo - remove user posts

    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });

    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });

    return res.json({ msg: "user removed" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});

// @route PUT api/profile/experience
// @desc Update Profile with experience
// @access Private
router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required")
        .not()
        .isEmpty(),
      check("company", "Company is required")
        .not()
        .isEmpty(),
      check("from", "FromDate is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    console.log("req.user.id", req.user.id);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      //unshift to add to start of list
      await profile.experience.unshift(newExp);
      await profile.save();

      return res.json({ msg: "Experience added." });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  }
);

// @route DELETE /api/profile/experience/:exp_id
// @desc Delete experience
// @access Private
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    // get the remove index
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);

    await profile.save();

    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: "server error" });
  }
});

// @route PUT api/profile/education
// @desc Update Profile with education
// @access Private
router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required")
        .not()
        .isEmpty(),
      check("degree", "Degree is required")
        .not()
        .isEmpty(),
      check("fieldofstudy", "Field of Study is required")
        .not()
        .isEmpty(),
      check("from", "FromDate is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    console.log("req.user.id", req.user.id);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      //unshift to add to start of list
      await profile.education.unshift(newEdu);
      await profile.save();

      return res.json({ msg: "Education added." });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  }
);

// @route DELETE /api/profile/education/:exp_id
// @desc Delete education
// @access Private
router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    // get the remove index
    const removeIndex = await profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id);

    await profile.education.splice(removeIndex, 1);

    await profile.save();

    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    sn;
    return res.status(500).json({ msg: "server error" });
  }
});

// @route /api/profile/github/:username
// @desc Get user github repos
// @access public
router.get("/github/:username", async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githubClientId"
      )}&client_secret=${config.get("githubSecret")}`,
      method: "GET",
      headers: { "user-agent": "node.js" }
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);

      if (response.statusCode !== 200) {
        return res.status(400).json({ msg: "No github profile found" });
      }

      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
