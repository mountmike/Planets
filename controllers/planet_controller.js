const express = require("express");
const router = express.Router();
const { Pool } = require("pg")
const connectionString = 'postgres://planets_app_user:joLTSA83h7sVmESHo9ECwedf3xL84McS@dpg-cg649ed269v5l64n0fig-a/planets_app'
const db = new Pool({
    connectionString: connectionString,
    user: 'planets_app_user',
    host: 'dpg-cg649ed269v5l64n0fig-a',
    hostname: 'dpg-cg649ed269v5l64n0fig-a',
    database: 'planets_app',
    password: 'joLTSA83h7sVmESHo9ECwedf3xL84McS',
    port: 5432,
});

// Get all planets | planets home page
router.get("/", (req, res) => {
    // if (!req.session.userID) {
    //     res.redirect("/sessions/login")
    // } else {
        let sql = "select * from planets order by id asc;";
        db.query(sql, (err, dbResponse) => {
            if (err) {
                console.log(err);
            } else {
                const planets = dbResponse.rows;
                res.render("all_planets", { planets, title: "See All Planets", user: req.session.email })
            } 
        });
    // }
});
// Get form for adding new planet
router.get("/new", (req, res) => {
    if (!req.session.userID) {
        res.redirect("/sessions/login")
    } else {
        res.render("new_planet", { title: "Add New Planet", user: req.session.email } )
    }
})
// create new planet
router.post("/", (req, res) => {
    const sql = `INSERT into planets (name, diameter, mass, moon_count, image_url) VALUES ($1, $2, $3, $4, $5);`
    const values = [req.body.name, req.body.diameter, req.body.mass, req.body.moon_count, req.body.image_url]
    db.query(sql, values, (err, dbRes) => {
        res.redirect("/planets")
    })
});
// get page of details on planet ID
router.get("/:ID", (req, res) => {
    if (!req.session.userID) {
        res.redirect("/sessions/login")
    } else {
        const planetID = req.params.ID;
        const sql = `select * from planets where id = $1`;
        db.query(sql, [planetID], (err, dbResponse) => {
            if (err) {
                console.log(err);
            } else {
                const planet = dbResponse.rows[0];
                res.render("planet_details", { planet, title: `${planet.name} Details`, user: req.session.email })
            } 
        });
    }
});
// get form for editing planet details
router.get("/:ID/edit", (req, res) => {
    if (!req.session.userID) {
        res.redirect("/sessions/login")
    } else {
        const planetID = req.params.ID;
        const sql = `select * from planets where id = $1;`;
        db.query(sql, [planetID], (err, dbResponse) => {
            if (err) {
                console.log(err);
            } else {
                const planet = dbResponse.rows[0];
                res.render("edit_planet_details", { planet, title: "Edit Planet", user: req.session.email })
            } 
        });
    }
});
// update planet details with new info from form
router.put("/:ID", (req, res) => {
    const sql = `UPDATE planets set name = $1, diameter= $2, mass = $3, moon_count = $4, image_url = $5 where id = $6;`;
    const values = [req.body.name, req.body.diameter, req.body.mass, req.body.moon_count, req.body.image_url, req.params.ID]
    db.query(sql, values, (err, dbResponse) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect(`/planets/${req.params.ID}`)
        }
    })
});
// delete existing planet based on ID
router.delete("/:ID", (req, res) => {
    const sql = `DELETE FROM planets where id = $1`;
    db.query(sql, [req.params.ID], (err, dbResponse) => {
        res.redirect("/planets"); 
    })
});


module.exports = router