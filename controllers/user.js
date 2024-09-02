const User = require("../Models/user.js");

module.exports.renderSingupForm = (req, res) => {
    res.render("users/singup.ejs");
};

module.exports.singup = async (req, res) => {
    try{
    
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
        if (err) {
            return next(err);
        }
            req.flash("success", "Welcome to Wanderlust!");
            let redirectUrl = res.locals.redirectUrl || "/listings";  // (if we are direct login than isLoggedIn 
                                                                    // function doesn't trigger that's why we write this logic)
            res.redirect(redirectUrl);
    

});
} catch (e) {
req.flash("error", e.message);
res.redirect("/singup");
}
};

module.exports.login =  async (req, res) => {
    req.flash("success", "Welcome to Wanderlust!");
        let redirectUrl = res.locals.redirectUrl || "/listings";  // (if we are direct login than isLoggedIn 
                                                                // function doesn't trigger that's why we write this logic)
        res.redirect(redirectUrl);

};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are Logged out!");
        res.redirect("/listings");
    })
};
