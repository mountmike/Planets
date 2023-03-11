const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const { Pool } = require("pg")
const db = new Pool({
    database: "planets_app",
});

// router.get("/new", (req, res) => {
//     res.render("new_user", { title: "Create Account", layout: "layout_login" } )
// });

router.post("/", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, digestedPassword) => {
            const sql = `INSERT into users (email, password_digest) VALUES ($1, $2);`
            const values = [email, digestedPassword]
            db.query(sql, values, (err, dbResponse) => {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect("/sessions/login")
                }
            })
        })
    })
});


module.exports = router