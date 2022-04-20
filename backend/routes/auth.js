const express = require("express");
const { body, validationResult } = require("express-validator");
const { find, findOne } = require("../models/User");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const router = express.Router();

router.post(
  "/createuser",
  [
    //validations
    body("name", "Enter valid name").isLength({ min: 3 }),
    body("email", "Enter valid Email").isEmail(),
    body("password", "password must beat 8characters").isLength({ min: 8 }),
  ],async (req, res) => {
    //error handling
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ errors: "user alredy exitst" });
      }
      //password generation hash
      const salt = await bcrypt.genSaltSync(10);
      const securedPass = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securedPass,
      });

      //.then(user => res.json(user))
      //.catch(err => {console.log(err)
      //res.json({error:'plese enter unqui email',
      // message:err.message})
      // });

      res.json(user);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ errors: "some error occured" });
    }
  }
);

module.exports = router;
