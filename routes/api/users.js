const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// @route POST api/users
// @desc Register user
// @access Public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid e-mail').isEmail(),
    check('password',
        'Please enter a valid password of 6 or more characters').isLength({ min: 7 })
],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        console.log(req.body);
        res.send('User ROute');
    });

module.exports = router;