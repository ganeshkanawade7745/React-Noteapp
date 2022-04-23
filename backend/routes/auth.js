const express = require('express');
const { body, validationResult } = require("express-validator");
const { find, findOne } = require("../models/User");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const router = express.Router();
const jwt = require('jsonwebtoken');
const JWT_SECRET="ganeshkanawade";
const fetchuser = require('../middleware/fetchuser')

//rout 1 user

router.post('/createuser',
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
      // console.log(req.body);
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ errors: "user already exists" });
      }
      //hash password generation
      const salt = await bcrypt.genSaltSync(10);
      const securedPass = await bcrypt.hash(req.body.password, salt)
      //create user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securedPass,
      })
  
      const data = {
        user: {
          id: user.id
        }
      }
      const authtoken = jwt.sign(data, JWT_SECRET)
  
      // .then(user => res.json(user))
      // .catch(err => {console.log(err)
      //     res.json({error: 'please enter unique email',
      //     message : err.message
      //   }) //////
      // })  
      // console.log(authtoken)
      res.json({authtoken})
    } catch (error) {
      console.log(error.mesage);
      res.status(500).json({ errors: "some error occured" });
    }
  })
  
  
  //ROUTE 2 LOGIN 
  router.post('/login', [
    body('email', 'Enter valid EMail').isEmail(),
    body('password', 'Enter valid password').exists()
  ], async (req, res) => {
  
    const { email, password } = req.body;
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      //user not exists
      let user = await User.findOne({email});
      if (!user) {
        return res.status(400).json({ errors: "user not exists" });
      }
  
      const passwordComapre = await bcrypt.compare(password, user.password);
      //password comaprasion
      if(!passwordComapre){
        return res.status(400).json({ errors: "Login credentials are invalid" });
      }
  
     const payload = {
       user: {
         id : user.id
       }
     }
  
    const authtoken = jwt.sign(payload, JWT_SECRET)
    res.json({authtoken})
  
    } catch (error) {
      console.log(error.mesage);
      res.status(500).json({ errors: "some error occured" });
    }
  
  
  })
  //Raute 3 :getuser
  
router.post('/getuser', fetchuser , async(req,res )=>{
  try{
      userId = req.user.id
      const user = await User.findById(userId).select("-password");
      res.send(user);
  }catch (error) {
    console.log(error.mesage);
    res.status(500).json({ errors: "some error occured" });
  }
})


 
  


module.exports = router