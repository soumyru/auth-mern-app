const express = require('express');
const ensureAuthenticated  = require('../Middlewares/Auth');
const router = express.Router();

router.get("/", ensureAuthenticated, (req,res)=>{
    console.log("---logged in user details---", req.user)
    res.status(200).json([
        {
            name: "mobile",
            price: 100000
        },
        {
            name: "tv",
            price: 50000
        },
    ])
});

module.exports = router;