const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares.js");
const userController = require("../controllers/user.js");


router.route("/singup")
    .get(userController.renderSingupForm)
    .post(wrapAsync(userController.singup));

router.route("/login")
    .get((req, res) => {
        res.render("users/login.ejs");

    })
    .post(saveRedirectUrl,
        passport.authenticate
            ("local", { failureRedirect: '/login', failureFlash: true }),
        userController.login);

router.get("/logout", userController.logout);








router.get("/logout", userController.logout);


module.exports = router;