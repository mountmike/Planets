const express = require("express");
const app = express();
const PORT = process.env.PORT;
const expressLayouts = require("express-ejs-layouts");
const { Pool } = require("pg")
const db = new Pool({
    user: 'planets_app_user',
    host: 'postgres://planets_app_user:joLTSA83h7sVmESHo9ECwedf3xL84McS@dpg-cg649ed269v5l64n0fig-a/planets_app',
    hostname: 'dpg-cg649ed269v5l64n0fig-a',
    database: 'planets_app',
    password: 'joLTSA83h7sVmESHo9ECwedf3xL84McS',
    port: 5432,
});
const methodOverride = require("method-override");
const planetController = require("./controllers/planet_controller");
const userController = require("./controllers/user_controller");
const sessionController = require("./controllers/session_controller");
const session = require("express-session");

// configs
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout layout_login", false)
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}))
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    let method = req.body._method
    delete req.body._method
    return method
  }
}));
app.use(session({
    secret: 'go dogs go',
    resave: false,
    saveUninitialized: true,
}));


// routes
app.use("/planets", planetController)
app.use("/users", userController)
app.use("/sessions", sessionController)

app.get(["/", "", "/home"], (req, res) => {
    // if (!req.session.userID) {
    //     res.redirect("/sessions/login")
    // } else {
        res.render("home", { title: "Home", user: req.session.email })
    // }
});

// listening
app.listen(process.env.PORT || 3000, () => {
    console.log(`now listening on port ${process.env.PORT}`);
})