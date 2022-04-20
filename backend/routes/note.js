const express = require('express')
const router = express.Router();

router.get('/',(req,res)=>{
    a={
        name:"ganesh",
        role:"dev"
    }
    res.json(a);
})

module.exports=router